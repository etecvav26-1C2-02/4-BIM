from pathlib import Path
from biblioteca import Biblioteca
from excecoes import ErroDadosError


class RepositorioJSON:
    """Lê e grava somente o arquivo JSON, sem regras de empréstimo."""

    def __init__(self, caminho: Path | str = Path("dados") / "biblioteca.json") -> None:
        self.caminho = Path(caminho)

    def carregar(self) -> Biblioteca:
        """Lê o JSON e devolve uma Biblioteca montada."""
        # TODO: se o arquivo não existir, retornar Biblioteca() vazia.
        # TODO: tratar json.JSONDecodeError e estrutura inválida -> ErroDadosError.
        # TODO: usar Livro.from_dict() e Emprestimo.from_dict().
        # TODO: usar lista vazia quando faltar "livros" ou "emprestimos".
        pass

    def salvar(self, biblioteca: Biblioteca) -> None:
        """Grava os dados no JSON de forma segura."""
        # TODO: montar {"versao": 1, "livros": [...], "emprestimos": [...]}.
        # TODO: criar a pasta pai caso não exista.
        # TODO: escrever em arquivo temporário e substituir com Path.replace().
        # TODO: usar indent=2 e ensure_ascii=False.
        pass
