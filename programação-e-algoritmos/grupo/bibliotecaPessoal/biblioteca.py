import json
import os
import random

DATA_FILE = "biblioteca_dados.json"

books = []

STATUS_NAO_LIDO = "nao lido"
STATUS_LENDO = "lendo"
STATUS_LIDO = "lido"


def load_data():
    global books

    if not os.path.exists(DATA_FILE):
        books = []
        return

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)
        books = data.get("books", [])


def save_data():
    data = {
        "books": books
    }

    with open(DATA_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)


def ask_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Digite um número inteiro válido.")


def find_book_by_id(book_id):
    for book in books:
        if book["id"] == book_id:
            return book
    return None


def register_book():
    book_id = input("ID do livro: ")

    if find_book_by_id(book_id) is not None:
        print("Já existe um livro com este ID.")
        return

    title = input("Título: ")
    author = input("Autor: ")
    year = ask_int("Ano de publicação: ")
    genre = input("Gênero: ")
    pages = ask_int("Número de páginas: ")

    if pages <= 0:
        print("Número de páginas inválido.")
        return

    book = {
        "id": book_id,
        "title": title,
        "author": author,
        "year": year,
        "genre": genre,
        "pages": pages,
        "rating": None,
        "comment": "",
        "favorite": False,
        "status": STATUS_NAO_LIDO,
        "progress": 0
    }

    books.append(book)
    save_data()

    print("Livro cadastrado com sucesso!")


def progress_bar(book):
    pages = book["pages"]
    progress = book["progress"]

    filled = int((progress / pages) * 10) if pages else 0
    percent = int((progress / pages) * 100) if pages else 0
    bar = "█" * filled + "░" * (10 - filled)

    return f"[{bar}] {percent}%"


def show_book(book):
    print(f"ID: {book['id']}")
    print(f"Título: {book['title']}")
    print(f"Autor: {book['author']}")
    print(f"Ano: {book['year']} | Gênero: {book['genre']}")
    print(f"Páginas: {book['progress']}/{book['pages']} {progress_bar(book)}")
    print(f"Status: {book['status']}" + (" ⭐ Favorito" if book["favorite"] else ""))

    if book["rating"] is not None:
        print(f"Nota: {book['rating']}/5")
    else:
        print("Nota: ainda não avaliado")

    if book["comment"]:
        print(f"Comentário: {book['comment']}")

    print("-" * 40)


def list_books():
    if len(books) == 0:
        print("Nenhum livro cadastrado.")
        return

    print("\n--- Minha biblioteca ---")
    for book in books:
        show_book(book)


def rate_book():
    if len(books) == 0:
        print("Nenhum livro cadastrado.")
        return

    list_books()

    book_id = input("ID do livro para avaliar: ")
    book = find_book_by_id(book_id)

    if book is None:
        print("Livro não encontrado.")
        return

    rating = ask_int("Nota (1 a 5): ")

    if rating < 1 or rating > 5:
        print("Nota inválida. Use de 1 a 5.")
        return

    comment = input("Comentário (opcional): ")
    favorite = input("Marcar como favorito? (s/n): ").strip().lower() == "s"

    book["rating"] = rating
    book["comment"] = comment
    book["favorite"] = favorite

    save_data()

    print("Avaliação salva com sucesso!")


def update_progress():
    if len(books) == 0:
        print("Nenhum livro cadastrado.")
        return

    list_books()

    book_id = input("ID do livro: ")
    book = find_book_by_id(book_id)

    if book is None:
        print("Livro não encontrado.")
        return

    pages_read = ask_int(f"Páginas lidas (0 a {book['pages']}): ")

    if pages_read < 0 or pages_read > book["pages"]:
        print("Valor inválido.")
        return

    book["progress"] = pages_read

    if pages_read == 0:
        book["status"] = STATUS_NAO_LIDO
    elif pages_read == book["pages"]:
        book["status"] = STATUS_LIDO
    else:
        book["status"] = STATUS_LENDO

    save_data()

    print("Progresso atualizado com sucesso!")


def random_pick():
    if len(books) == 0:
        print("Nenhum livro cadastrado.")
        return

    book = random.choice(books)

    print("\nSurpresa! Que tal ler este?")
    show_book(book)


def statistics():
    total = len(books)

    print("\n--- Estatísticas ---")
    print(f"Total de livros: {total}")

    if total == 0:
        return

    rated = [book for book in books if book["rating"] is not None]
    if rated:
        average = sum(book["rating"] for book in rated) / len(rated)
        print(f"Nota média: {average:.1f}/5 ({len(rated)} avaliados)")

    read = sum(1 for book in books if book["status"] == STATUS_LIDO)
    print(f"Livros lidos: {read}")

    favorites = sum(1 for book in books if book["favorite"])
    print(f"Favoritos: {favorites}")

    genres = {}
    for book in books:
        genres[book["genre"]] = genres.get(book["genre"], 0) + 1

    print("Por gênero:")
    for genre, count in genres.items():
        print(f"  {genre}: {count}")


def search_books():
    term = input("Digite título ou autor para buscar: ").strip().lower()

    results = [
        book for book in books
        if term in book["title"].lower() or term in book["author"].lower()
    ]

    if len(results) == 0:
        print("Nenhum livro encontrado.")
        return

    print(f"\n--- Resultados ({len(results)}) ---")
    for book in results:
        show_book(book)


def filter_by_genre():
    genre = input("Gênero: ").strip().lower()

    results = [book for book in books if genre in book["genre"].lower()]

    if len(results) == 0:
        print("Nenhum livro encontrado.")
        return

    print(f"\n--- Gênero: {genre} ({len(results)}) ---")
    for book in results:
        show_book(book)


def show_menu():
    print("\n=== Biblioteca Pessoal ===")
    print("1 - Cadastrar livro")
    print("2 - Listar livros")
    print("3 - Avaliar livro")
    print("4 - Atualizar leitura")
    print("5 - Surpreenda-me (livro aleatório)")
    print("6 - Estatísticas")
    print("7 - Buscar livro")
    print("8 - Filtrar por gênero")
    print("9 - Sair")


def main():
    load_data()

    while True:
        show_menu()
        option = input("Escolha uma opção: ")

        if option == "1":
            register_book()
        elif option == "2":
            list_books()
        elif option == "3":
            rate_book()
        elif option == "4":
            update_progress()
        elif option == "5":
            random_pick()
        elif option == "6":
            statistics()
        elif option == "7":
            search_books()
        elif option == "8":
            filter_by_genre()
        elif option == "9":
            save_data()
            print("Sistema encerrado.")
            break
        else:
            print("Opção inválida.")


main()
