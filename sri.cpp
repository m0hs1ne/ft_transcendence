#include <iostream>
#include <fstream>
#include <sstream>
#include <cstdlib>

int main() {
    std::ifstream file("my.txt"); // Replace with the actual file name
    std::string line;
    
    while (std::getline(file, line)) {
        // std::istringstream iss(line);
        // std::string timestamp, message;
        // iss >> timestamp;
        // std::getline(iss, message);
        std::cout << line;
        std::string command = line;
          std::cout << command;
        int result = system(command.c_str());
      
        // if (result != 0) {
        //     std::cerr << "Failed to commit: " + message << std::endl;
        //     return 1;
        // }
    }

    file.close();

    return 0;
}