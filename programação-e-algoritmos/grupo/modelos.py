"""Modelos de domínio do Gerenciador de Biblioteca Pessoal."""

from dataclasses import dataclass
from datetime import date
from typing import ClassVar


@dataclass
class Livro:
    """Livro cadastrado no acervo."""

    id: int
    titulo: str
    autor: str
    genero: str
    ano: int
    paginas: int
    isbn: str | None = None
    disponivel: bool = True

    def to_dict(self) -> dict:
        """Converte o livro em dicionário pronto para ser salvo em JSON."""
        # TODO: devolver todos os campos em um dicionário.
        pass

    @classmethod
    def from_dict(cls, dados: dict) -> "Livro":
        """Cria um Livro a partir de um dicionário lido do JSON."""
        # TODO: usar dados.get("isbn") e dados.get("disponivel", True).
        pass

    def validar(self) -> None:
        """Valida os campos do livro.

        Levanta ValueError se título/autor/gênero estiverem vazios,
        se o ano estiver fora de 1450..ano atual ou se páginas <= 0.
        """
        # TODO: aplicar .strip() nos textos antes de validar.
        pass

    def __str__(self) -> str:
        """Retorna uma linha legível, ex.: "[3] Dom Casmurro - ..."."""
        # TODO: exibir situação "Disponível" ou "Emprestado".
        pass


@dataclass
class Emprestimo:
    """Empréstimo de um livro para um leitor."""

    PRAZO_DIAS: ClassVar[int] = 14

    id: int
    livro_id: int
    nome_leitor: str
    data_emprestimo: date
    data_prevista: date
    data_devolucao: date | None = None

    def esta_ativo(self) -> bool:
        """Retorna True enquanto o livro não foi devolvido."""
        # TODO: verificar se data_devolucao é None.
        pass

    def esta_atrasado(self, hoje: date | None = None) -> bool:
        """Retorna True se o empréstimo está ativo e o prazo venceu."""
        # TODO: usar date.today() quando "hoje" não for informado.
        pass

    def dias_atraso(self, hoje: date | None = None) -> int:
        """Retorna a quantidade de dias de atraso (0 se não houver)."""
        # TODO: calcular a diferença entre hoje e data_prevista.
        pass

    def to_dict(self) -> dict:
        """Converte o empréstimo em dicionário com datas em formato ISO."""
        # TODO: usar .isoformat() nas datas; None permanece None.
        pass

    @classmethod
    def from_dict(cls, dados: dict) -> "Emprestimo":
        """Cria um Emprestimo a partir de um dicionário lido do JSON."""
        # TODO: converter datas com date.fromisoformat().
        pass
