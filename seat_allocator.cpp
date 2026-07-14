#include <iostream>
#include <fstream>
#include <vector>
#include <string>

using namespace std;

int main()
{
    int requiredSeats;
    cin >> requiredSeats;

    ifstream fin("cpp/seats.txt");

    vector<pair<string, string>> seats;
    string seatNo, status;

    while (fin >> seatNo >> status)
    {
        seats.push_back({seatNo, status});
    }

    fin.close();

    vector<string> allocated;

    for (int i = 0; i < seats.size() && allocated.size() < requiredSeats; i++)
    {
        if (seats[i].second == "Available")
        {
            seats[i].second = "Booked";
            allocated.push_back(seats[i].first);
        }
    }

    ofstream fout("cpp/seats.txt");

    for (auto s : seats)
    {
        fout << s.first << " " << s.second << endl;
    }

    fout.close();

    for (auto seat : allocated)
    {
        cout << seat << endl;
    }

    return 0;
}