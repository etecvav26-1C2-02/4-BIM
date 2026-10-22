from dataclasses import dataclass
from datetime import date
from modelos import Livro

@dataclass
class Biblioteca:
    livro: list[Livro]
