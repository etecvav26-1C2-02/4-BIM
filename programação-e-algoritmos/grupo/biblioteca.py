from datetime import date
from excecoes import (
    LivroEmprestadoError,
    LivroIndisponivelError,
    LivroNaoEncontradoError,
)
from modelos import Emprestimo, Livro


class Biblioteca:
    """Guarda os livros e os empréstimos em memória."""

    def __init__(
        self,
        livros: list[Livro] | None = None,
        emprestimos: list[Emprestimo] | None = None,
    ) -> None:
        self.livros: list[Livro] = livros if livros is not None else []
        self.emprestimos: list[Emprestimo] = (
            emprestimos if emprestimos is not None else []
        )

    # ------------------------------------------------------------------
    # Livros
    # ------------------------------------------------------------------
    def cadastrar_livro(
        self,
        titulo: str,
        autor: str,
        genero: str,
        ano: int,
        paginas: int,
        isbn: str | None = None,
    ) -> Livro:
        """Cria, valida e adiciona um livro com ID automático."""
        # TODO: gerar ID com _proximo_id_livro(), criar Livro, validar e guardar.
        
        pass

    def atualizar_livro(self, id: int, **campos: object) -> Livro:
        """Altera campos de um livro existente e valida o resultado."""
        # TODO: buscar_por_id(), aplicar apenas campos permitidos e validar().
        pass

    def remover_livro(self, id: int) -> None:
        """Remove um livro que não tenha empréstimo ativo."""
        # TODO: levantar LivroEmprestadoError se houver empréstimo ativo.
        pass

    def buscar_livros(self, termo: str, campo: str = "titulo") -> list[Livro]:
        """Busca parcial e sem diferenciar maiúsculas/minúsculas."""
        # TODO: campo pode ser "titulo", "autor" ou "genero".
        pass

    def filtrar_livros(
        self,
        genero: str | None = None,
        ano_min: int | None = None,
        ano_max: int | None = None,
        disponivel: bool | None = None,
    ) -> list[Livro]:
        """Filtra o acervo combinando os critérios informados."""
        # TODO: aplicar somente os filtros que não forem None.
        pass

    def buscar_por_id(self, id: int) -> Livro:
        """Retorna o livro com o ID informado."""
        # TODO: levantar LivroNaoEncontradoError quando não existir.
        pass

    # ------------------------------------------------------------------
    # Empréstimos
    # ------------------------------------------------------------------
    def emprestar(
        self,
        livro_id: int,
        nome_leitor: str,
        hoje: date | None = None,
    ) -> Emprestimo:
        """Registra um empréstimo e marca o livro como indisponível."""
        # TODO: validar disponibilidade e definir data_prevista = hoje + 14 dias.
        pass

    def devolver(
        self,
        emprestimo_id: int,
        hoje: date | None = None,
    ) -> Emprestimo:
        """Registra a devolução e libera o livro."""
        # TODO: preencher data_devolucao e marcar o livro como disponível.
        pass

    def emprestimos_ativos(self) -> list[Emprestimo]:
        """Retorna os empréstimos que ainda não foram devolvidos."""
        # TODO: filtrar por esta_ativo().
        pass

    def emprestimos_atrasados(self, hoje: date | None = None) -> list[Emprestimo]:
        """Retorna os empréstimos ativos com o prazo vencido."""
        # TODO: filtrar por esta_atrasado(hoje).
        pass

    # ------------------------------------------------------------------
    # Estatísticas
    # ------------------------------------------------------------------
    def estatisticas(self) -> dict:
        """Monta o resumo do acervo descrito na seção 6 das instruções."""
        # TODO: usar Counter para gêneros e defaultdict(list) para médias.
        # TODO: incluir livro_mais_longo e livro_mais_antigo.
        pass

    # ------------------------------------------------------------------
    # Helpers internos
    # ------------------------------------------------------------------
    def _proximo_id_livro(self) -> int:
        """Gera um ID de livro que nunca tenha sido usado."""
        # TODO: usar o maior ID + 1 sem reutilizar IDs removidos.
        pass

    def _proximo_id_emprestimo(self) -> int:
        """Gera um ID de empréstimo que nunca tenha sido usado."""
        # TODO: usar o maior ID + 1 sem reutilizar IDs removidos.
        pass
