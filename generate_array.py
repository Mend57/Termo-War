vogal = 'aeiou'
consoante = 'bcdfghjklmnpqrstvwxyz'

def exclui(line):
    prevchar = '+'
    for char in line:
        if char == prevchar and char not in "rs":
            return False
        prevchar = char
    return True

def consSeguida(line):
    prevchar, prevprevchar = '+', '-'
    for i, char in enumerate(line):
        if i > 1:
            if char == prevchar == prevprevchar:
                return False
            prevprevchar, prevchar = prevchar, char
    return True

f2 = open("5_letras.txt", "w")
with open("dicio.txt", "r") as f:
    for line in f:
        if len(line) == 6 and line[-2] not in 'yvtcqw' and len([x for x in line if x in consoante]) < 4 and exclui(line) and consSeguida(line):
             f2.write(line)

    