"""This is the main file to execute the mastermind game."""
import time
import random
import GUI


def initialize_board():
    """Initialize the board."""
    # Access board field board[position][row]
    board = [["blank" for row in range(12)] for position in range(8)]
    print(chr(27) + '[2J')
    print("Welcome to play Mastermind")
    print("The available colors are: ")
    print(colors)
    print('Press enter to continue')
    input()
    return board


def set_position(board, position, row, color):
    # 11-row to set start printing at the bottom of the board
    board[position][(11-row)] = color


def get_color(position, row):
    color = (input('Enter color: ')).lower()
    if color in colors:  # check if input is a valid color
        if colors.index(color) > 5:
            color = colors[(colors.index(color)-6)]
        # 11-row to set start printing at the bottom of the board
        return color
    else:
        print('\x1b[1A\x1b[2K\x1b[1A')
        print("Not a valid color, try again")
        time.sleep(2)
        print('\x1b[1A\x1b[2K\x1b[1A')
        return get_color(position, row)



def gen_secretcode():
    print("Secret code succesfully created")
    secretcode = []
    for position in range(4):
        # picks 4 random values from full color names in  array 'colors'
        secretcode.append(colors[random.randint(0, 5)])
    print("This is the secretcode: " + str(secretcode))
    time.sleep(2)
    return secretcode


def submit():
    # print('\x1b[1A\x1b[2K\x1b[1A\x1b[1A\x1b[2K\x1b[1A')
    # delete last two text rows
    submit_input = (input('If you want to submit your guess enter "done"' +
                          ', otherwise enter "repeat" ')).lower()
    if submit_input == 'done':
        return (True)
    elif submit_input == 'repeat':
        print('\x1b[1A\x1b[2K\x1b[1A')
        return (False)
    else:
        print('\x1b[1A\x1b[2K\x1b[1A')
        print("Please enter 'done' or 'repeat', try again")
        time.sleep(2)
        print('\x1b[1A\x1b[2K\x1b[1A')
        return submit()


def reset_row(board, row):
    position = 0
    while (position < 4):
        set_position(board, position, row, 'blank')
        position += 1


def get_feedback(board, row, scode):
    # Create variables
    right_place = 0
    right_color = 0
    row_scode = []
    for col in scode:
        row_scode.append(col)
    row_given = []
    for i in range(4):
        row_given.append(board[i][11-row])

    # Check if right positions are given
    for i in range(4):
        # comparison goes backwards so that won't point out of index
        if row_scode[3-i] == row_given[3-i]:
            right_place += 1
            row_given.pop(3-i)
            row_scode.pop(3-i)

    # Check if right colors are on the board
    for color_given in row_given:
        m = 0
        for color_scode in row_scode:
            if color_scode == color_given:
                right_color += 1
                row_scode.pop(m)
                break
            m += 1

    # Create feedback string
    feedback = []
    for i in range(right_place):
        feedback.append("black")
    for i in range(right_color):
        feedback.append("white")

    # Check whether final solution was found
    return feedback


def addFeedbackToBoard(feedback, board, row):
    i = 0
    for color in feedback:
        board[4+i][11-row] = color
        i += 1

def solved(feedback, row):
    # check if final solution was found
    done = True
    if len(feedback) != 4:
        return False
    else:
        for color in feedback:
            if color != 'black':
                done = False
    if done is True:
            print("You are a Mastermind")
            print("You cracked the Secretcode in %d rounds" %(row+1))
            return True

def round(board, scode, position, row):
    GUI.print_board(board)
    while (position < 4):
        color = get_color(position, row)
        if color != 'blank':
            set_position(board, position, row, color)
            position += 1
            GUI.print_board(board)
        else:
            position -= 1
            GUI.print_board(board)
    if not submit():
        reset_row(board, row)
        return round(board, scode, 0, row)
    else:
        feedback = get_feedback(board, row, scode)
        addFeedbackToBoard(feedback, board, row)
        GUI.print_board(board)
        if solved(feedback, row) is False:
            print("next round")
            round(board, scode, 0, (row+1))


if __name__ == "__main__":
    # set variables
    colors = ["cyan", "purple", "red", "green", "blue",
              "yellow", "c", "p", "r", "g", "b", "y"]

    board = initialize_board()
    scode = gen_secretcode()    # secret solution pattern
    row = 0          # row number on board
    position = 0     # position number on board
    round(board, scode, position, row)
