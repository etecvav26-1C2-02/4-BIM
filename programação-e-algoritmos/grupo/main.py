from biblioteca import Biblioteca
from excecoes import BibliotecaError
from repositorio import RepositorioJSON


def exibir_menu() -> None:
    print("""=== BIBLIOTECA PESSOAL ===
1. Cadastrar livro
2. Listar todos os livros
3. Buscar livro
4. Atualizar livro
5. Remover livro
6. Emprestar livro
7. Devolver livro
8. Ver empréstimos atrasados
9. Estatísticas
0. Sair (salva automaticamente)""")


def cadastrar(biblioteca: Biblioteca, repositorio: RepositorioJSON) -> None:
    """Opção 1: lê os dados e cadastra um livro."""
    # TODO: pedir título, autor, gênero, ano, páginas e ISBN.
    # TODO: chamar biblioteca.cadastrar_livro() e salvar.
    pass


def listar_livros(biblioteca: Biblioteca, repositorio: RepositorioJSON) -> None:
    """Opção 2: mostra todos os livros do acervo."""
    # TODO: imprimir cada livro com print(livro).
    pass


def buscar(biblioteca: Biblioteca, repositorio: RepositorioJSON) -> None:
    """Opção 3: busca livros por termo e campo."""
    # TODO: perguntar o termo e o campo (título, autor ou gênero).
    pass


def atualizar(biblioteca: Biblioteca, repositorio: RepositorioJSON) -> None:
    """Opção 4: atualiza os campos informados de um livro."""
    # TODO: pedir o ID e os campos a alterar; salvar ao final.
    pass


def remover(biblioteca: Biblioteca, repositorio: RepositorioJSON) -> None:
    """Opção 5: remove um livro do acervo."""
    # TODO: pedir o ID, chamar remover_livro() e salvar.
    pass


def emprestar(biblioteca: Biblioteca, repositorio: RepositorioJSON) -> None:
    """Opção 6: registra o empréstimo de um livro."""
    # TODO: pedir ID do livro e nome do leitor; salvar ao final.
    pass


def devolver(biblioteca: Biblioteca, repositorio: RepositorioJSON) -> None:
    """Opção 7: registra a devolução de um empréstimo."""
    # TODO: pedir o ID do empréstimo; salvar ao final.
    pass


def exibir_atrasados(biblioteca: Biblioteca, repositorio: RepositorioJSON) -> None:
    """Opção 8: lista os empréstimos atrasados e os dias de atraso."""
    # TODO: usar biblioteca.emprestimos_atrasados().
    pass


def exibir_estatisticas(biblioteca: Biblioteca, repositorio: RepositorioJSON) -> None:
    """Opção 9: mostra o resumo do acervo."""
    # TODO: formatar o dicionário retornado por estatisticas().
    pass


def main() -> None:
    """Carrega os dados e mantém o menu em execução até a opção 0."""
    repositorio = RepositorioJSON()
    biblioteca = repositorio.carregar()

    acoes = {
        "1": cadastrar,
        "2": listar_livros,
        "3": buscar,
        "4": atualizar,
        "5": remover,
        "6": emprestar,
        "7": devolver,
        "8": exibir_atrasados,
        "9": exibir_estatisticas,
    }

    while True:
        exibir_menu()
        opcao = input("Escolha uma opção: ").strip()

        if opcao == "0":
            repositorio.salvar(biblioteca)
            print("Dados salvos.")
            break

        acao = acoes.get(opcao)
        if acao is None:
            print("Opção inválida. Tente novamente.")
            continue

        try:
            acao(biblioteca, repositorio)
        except BibliotecaError as erro:
            print(f"Erro: {erro}")
        except ValueError as erro:
            print(f"Dados inválidos: {erro}")


if __name__ == "__main__":
    main()
