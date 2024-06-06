#include "cell.h"
#include <iostream>
#include <string>
using namespace std;

Cell::Cell(size_t r, size_t c): r{r}, c{c} {}

void Cell::setPiece(Colour colour){ // Place a piece of given colour here.
    if (this->colour == Colour::NoColour){
        this->colour = colour;
        State s = {StateType::NewPiece, colour, Direction::NW};
        setState(s);
        notifyObservers();
    }   
}

void Cell::toggle(){ // Toggles my colour.
    if (colour == Colour::White) colour = Colour::Black;
    else if (colour == Colour::Black) colour = Colour::White;
}      

Direction Cell::getdirection(Subject<Info, State> &whoFrom){
    int subj_row = whoFrom.getInfo().row;
    int subj_col = whoFrom.getInfo().col;
    int i = r - subj_row;
    int j = c - subj_col;
    Direction dir;
    if (i == 0 && j == 1) dir = Direction::W;
    if (i == 0 && j == -1) dir = Direction::E;
    if (j == 0 && i == 1) dir = Direction::N;
    if (j == 0 && i == -1) dir = Direction::S;
    if (i == 1 && j == 1) dir = Direction::NW;
    if (i == -1 && j == -1) dir = Direction::SE;
    if (i == -1 && j == 1) dir = Direction::SW;
    if (i == 1 && j == -1) dir = Direction::NE;
    return dir;
}

void Cell::notify(Subject<Info, State> &whoFrom) { 
    State notifier_state = whoFrom.getState();
    State my_state = getState();

    if (colour == Colour::NoColour){
        return;
    }

    Direction d = getdirection(whoFrom);

    if (notifier_state.type == StateType::NewPiece){ 
        if (colour != notifier_state.colour){ //if colour different   
            setState({StateType::Relay,colour,d}); //change state
            notifyObservers(); 
        }
    } else if (notifier_state.type == StateType::Relay){ 
        if (d == notifier_state.direction){
            if (colour == notifier_state.colour){ //if colour same
                setState({StateType::Relay,colour,d});
                notifyObservers();
            }
            else if (colour != notifier_state.colour){ //if colour different
                if (d == Direction::W){
                    d = Direction::E;
                } 
                else if (d == Direction::E) {
                    d = Direction::W;
                }
                else if (d == Direction::N) {
                    d = Direction::S;
                }
                else if (d == Direction::S){
                    d = Direction::N;
                } 
                else if (d == Direction::NW){
                    d = Direction::SE;
                }
                else if (d == Direction::SE){
                    d = Direction::NW;
                } 
                else if (d == Direction::SW){
                    d = Direction::NE;
                } 
                else if (d == Direction::NE) {
                    d = Direction::SW;  
                }                        
                setState({StateType::Reply,colour,d});
                notifyObservers();
            }
        }
    } else if (notifier_state.type == StateType::Reply){
        if (d == notifier_state.direction){
            if (my_state.type == StateType::Relay){
            toggle();
            setState({StateType::Reply,colour,d});
            notifyObservers();
            }       
        }
    }
}


Info Cell::getInfo() const {
    return {r,c,colour};
}
