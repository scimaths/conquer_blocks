DONE
User A joins -> Server initializes user A, sends id
User B joins -> Server initializes user B, sends id

Once both have joined, server sends dictionary of user objects


Akshat start this
<!-- @akshat time loop how? -->
@akshat right here okay


After giving confirmation for all movements, iterate over all blocks, call block.process()

Ashwin implementing
Create board object, send to both users from server.



Expected structure for movesForRound -

movesForRound = {
    'player1': {
        'playersCreated': {
            playerID: playerObject,
            ...
        },
        'playerMovements': {
            playerID: (x, y),
            ...
        },
        'techInvestment': {
            value: value,
        }
    },
    'player2': {
        ...
    }
}




record time.time() after first refresh



check in update if diff of time > 15 seconds or player clicks submit
if yes, send movesForRound to server
wait for output of server
record time.time()
check in update if diff of time > 15 seconds or player clicks submit
...