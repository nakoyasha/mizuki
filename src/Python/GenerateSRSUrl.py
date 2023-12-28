import sys

def generate_base63_entropy(input):
    t = 0

    for n in range(len(input)):
        t = (t << 5) -t + list(bytes(input, encoding="utf8"))[n]
        t = t & t
    t = t % (2**32) 
    return t

def base36encode(number):
    if not isinstance(number, int):
        raise TypeError('number must be an integer')
    is_negative = number < 0
    number = abs(number)

    alphabet, base36 = ['0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '']

    while number:
        number, i = divmod(number, 36)
        base36 = alphabet[i] + base36
    if is_negative:
        base36 = '-' + base36

    return base36.lower() or alphabet[0].lower()

print(base36encode(generate_base63_entropy("en/characters/" + sys.argv[1] + ".json")))