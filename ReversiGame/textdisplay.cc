#include "textdisplay.h"
#include "subject.h"
using namespace std;

TextDisplay::TextDisplay(int n): gridSize{n} {
    theDisplay.resize(gridSize, vector<char>(gridSize, '-'));
}

void TextDisplay::notify(Subject<Info, State> &whoNotified) {
    auto curstate = whoNotified.getInfo();
    if (curstate.colour == Colour::Black){
        theDisplay[curstate.row][curstate.col] = 'B';
    }
    else if (curstate.colour == Colour::White){
        theDisplay[curstate.row][curstate.col] = 'W';
    }   
}

ostream& operator<<(std::ostream &out, const TextDisplay &td){
    for (auto r : td.theDisplay) {
        for (auto c : r){
            out << c;
        }
        out << endl;
    }
    return out;
}

