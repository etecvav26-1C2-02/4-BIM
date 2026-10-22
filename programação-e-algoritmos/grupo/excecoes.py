"""Exceções personalizadas do projeto."""


class BibliotecaError(Exception):
    """Classe base de todos os erros do projeto."""


class LivroNaoEncontradoError(BibliotecaError):
    """ID de livro ou de empréstimo inexistente."""


class LivroIndisponivelError(BibliotecaError):
    """Tentativa de emprestar um livro que já está emprestado."""


class LivroEmprestadoError(BibliotecaError):
    """Tentativa de remover um livro que está emprestado."""


class ErroDadosError(BibliotecaError):
    """JSON inválido ou com estrutura inesperada."""
