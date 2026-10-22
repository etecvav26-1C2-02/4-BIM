from dataclasses import dataclass
from datetime import date

@dataclass
class Livro:
    id: int
    ano: int
    paginas: int
    titulo: str
    autor: str
    genero: str

    def to_dict():
        pass

    def validar():
        pass
    def __str__(self):
        pass

@dataclass
class Emprestimo:
    id: int
    livro_id: int
    nome_leitor: str
    data_emprestimo: date
    data_prevista: date

    def esta_ativo():
        pass

    def esta_atrasado(hoje: date | None = None) -> bool:
        pass

    def dias_atraso(hoje: date | None = None) -> int:
        pass

    def to_dict():
        pass

    def from_dict(dados):
        pass