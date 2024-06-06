#include <iostream>
#include <string>
// You may include other allowed headers, as needed
#include "grid.h"
#include "state.h"
using namespace std;

// Do not remove any code; do not add code other than where indicated.

int main(int argc, char *argv[]) {
  cin.exceptions(ios::eofbit|ios::failbit);
  string cmd;
  Grid g;

  int count = 0;

  try {
  while (true) {
    cin >> cmd;
    if (cmd == "new") {
      int n;
      cin >> n;
      // Add code here
      g.init(n);
      cout << g;
    }
    else if (cmd == "play") {
      int r = 0, c = 0;
      cin >> r >> c;
      // Add code here
      if (count % 2 != 0){
        g.setPiece(r,c,Colour::Black);
      }
      else {
        g.setPiece(r,c,Colour::White);
      }
      if(g.isFull()){
        Colour winner = g.whoWon();
        cout << g;
        if (winner == Colour::NoColour){
          cout << "Tie!" << endl;
        }
        else if (winner == Colour::Black){
          cout << "Black wins!" << endl;
        }
        else if (winner == Colour::White){
          cout << "White wins!" << endl;
        }
        break;
      }
      cout << g;
    }
    count++;
  }
  }
  catch (ios::failure &) {}  // Any I/O failure quits
}
