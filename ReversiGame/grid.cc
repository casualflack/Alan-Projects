#include "grid.h"
#include "info.h"
#include "textdisplay.h"
using namespace std;


Grid::~Grid(){ //destructor
    delete td;
}

void Grid::init(size_t n){ // Sets up an a x a grid.  Clears old grid, if necessary
    int a = n;
    delete td;
    td = new TextDisplay{a};
    

    for (int i = 0; i < a; i++){
        vector<Cell> rowofcells;
        for (int j = 0; j < a; j++){
            rowofcells.emplace_back(i,j);
            td->notify(rowofcells.back());
        }
        theGrid.emplace_back(rowofcells);
    }

    //set each cell's observers
    for (int i = 0; i < a; i++) {
        for (int j = 0; j < a; j++){
            if (i > 0) theGrid[i][j].attach(&theGrid[i - 1][j]);
            if (i < a - 1) theGrid[i][j].attach(&theGrid[i + 1][j]);
            if (j > 0) theGrid[i][j].attach(&theGrid[i][j - 1]);
            if (j < a - 1) theGrid[i][j].attach(&theGrid[i][j + 1]);
            if (i < a - 1 && j < a - 1) theGrid[i][j].attach(&theGrid[i+1][j+1]);
            if (i > 0 && j > 0) theGrid[i][j].attach(&theGrid[i-1][j-1]);
            if (i > 0 && j < a - 1) theGrid[i][j].attach(&theGrid[i-1][j+1]);
            if (j > 0 && i < a - 1) theGrid[i][j].attach(&theGrid[i+1][j-1]);

            //set the textdisplay as an observer of the grid
            theGrid[i][j].attach(td); 
        }
    }
    setPiece(a/2,a/2,Colour::Black);
    setPiece(a/2 - 1, a/2 - 1, Colour::Black);
    setPiece(a/2 - 1, a/2, Colour::White);
    setPiece(a/2, a/2 - 1, Colour::White);
}

bool Grid::isFull() const{ // Is the game over, i.e., is the grid full?
    for (size_t i = 0; i < theGrid.size(); i++){
        for (size_t j = 0; j < theGrid.size(); j++){
            Info x = theGrid[i][j].getInfo();
            if (x.colour == Colour::NoColour) return false;
        }
    }
    return true;
}

Colour Grid::whoWon() const{ // Who has more pieces when the board is full?
    int blackcount = 0;
    int whitecount = 0;
    for (size_t i = 0; i < theGrid.size(); i++){
        for (size_t j = 0; j < theGrid.size(); j++){
            Info x = theGrid[i][j].getInfo();
            if (x.colour == Colour::Black) blackcount++;
            else whitecount++;
        }
    }
    if (blackcount > whitecount) return Colour::Black;
    if (blackcount == whitecount) return Colour::NoColour;
    else return Colour::White;
} 

bool Grid::setPiece(size_t r, size_t c, Colour colour){// Plays piece at row r, col c. True if valid placement/coordinate, False otherwise
    if (r > theGrid.size() - 1 || r < 0 ||
    c > theGrid.size() - 1 || c < 0) {
        return false;
    }
    Info x = theGrid[r][c].getInfo();
    if (x.colour != Colour::NoColour) return false;
    theGrid[r][c].Cell::setPiece(colour); //set the colour of the new piece
    return true;
} 

void Grid::toggle(size_t r, size_t c){// Flips piece at row r, col c.
    theGrid[r][c].toggle();
}  

ostream& operator<<(ostream &out, const Grid &g) {
    out << *(g.td);
    return out;
}




