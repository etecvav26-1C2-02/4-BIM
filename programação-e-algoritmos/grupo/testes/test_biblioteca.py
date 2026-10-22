"""Testes automatizados do Gerenciador de Biblioteca Pessoal."""

import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path

from biblioteca import Biblioteca
from excecoes import LivroEmprestadoError, LivroIndisponivelError
from modelos import Emprestimo, Livro
from repositorio import RepositorioJSON


class TestEmprestimo(unittest.TestCase):
    """Testes das regras de prazo do empréstimo."""

    def test_esta_atrasado_quando_prazo_vencido(self) -> None:
        """Deve ser True quando hoje ultrapassa data_prevista."""
        # TODO: montar um Emprestimo e comparar com uma data posterior.
        pass

    def test_esta_atrasado_falso_quando_devolvido(self) -> None:
        """Deve ser False quando o livro já foi devolvido."""
        # TODO: preencher data_devolucao e verificar o resultado.
        pass

    def test_dias_atraso(self) -> None:
        """Deve retornar a diferença em dias, ou 0 sem atraso."""
        # TODO: comparar data_prevista com hoje.
        pass


class TestBiblioteca(unittest.TestCase):
    """Testes das regras de negócio."""

    def test_emprestar_livro_indisponivel(self) -> None:
        """Emprestar o mesmo livro duas vezes deve levantar erro."""
        # TODO: usar assertRaises(LivroIndisponivelError).
        pass

    def test_remover_livro_emprestado(self) -> None:
        """Remover livro com empréstimo ativo deve levantar erro."""
        # TODO: usar assertRaises(LivroEmprestadoError).
        pass


class TestLivro(unittest.TestCase):
    """Testes do modelo Livro."""

    def test_to_dict_e_from_dict_ida_e_volta(self) -> None:
        """Livro -> dict -> Livro deve produzir objeto igual."""
        # TODO: montar um Livro e comparar com Livro.from_dict().
        pass

    def test_validar_ano_fora_do_intervalo(self) -> None:
        """Ano anterior a 1450 ou futuro deve levantar ValueError."""
        # TODO: usar assertRaises(ValueError).
        pass

    def test_validar_titulo_vazio(self) -> None:
        """Título vazio ou só com espaços deve levantar ValueError."""
        # TODO: usar assertRaises(ValueError).
        pass


class TestRepositorioJSON(unittest.TestCase):
    """Testes de persistência com arquivo temporário."""

    def test_salvar_e_carregar_preserva_dados(self) -> None:
        """Salvar e carregar deve manter livros e empréstimos."""
        # TODO: usar tempfile.TemporaryDirectory() e não tocar no JSON real.
        pass


if __name__ == "__main__":
    unittest.main()
