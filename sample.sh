# Login
COOKIE=$(curl -s -c - -X POST localhost:8000/api/users/sign_in -H 'Content-Type: application/json' -d '{"username":"admin", "password":"admin"}' | grep 'access_toke' | awk 'END {print $7}')

echo $COOKIE

# Create users
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/users/new -H 'Content-Type: application/json' -d '{"username":"user1"}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/users/new -H 'Content-Type: application/json' -d '{"username":"user2"}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/users/new -H 'Content-Type: application/json' -d '{"username":"user3"}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/users/new -H 'Content-Type: application/json' -d '{"username":"user4"}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/users/new -H 'Content-Type: application/json' -d '{"username":"user5"}'

# Create teams
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/teams/new -H 'Content-Type: application/json' -d '{"name": "team1", "description": "some description", "teamLeader": "user1", "productManager": "user2"}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/teams/new -H 'Content-Type: application/json' -d '{"name": "team2", "description": "some description", "teamLeader": "user3", "productManager": "user4"}'

# Create Round
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/rounds/new -H 'Content-Type: application/json' -d '{"id": "202201", "name": "winter2022"}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/rounds/new -H 'Content-Type: application/json' -d '{"id": "202202", "name": "spring2022"}'

# Create OKR
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/new -H 'Content-Type: application/json' -d '{"description": "Maintenance OKR", "teamName": "team1", "roundId": 202201}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/new -H 'Content-Type: application/json' -d '{"description": "Maintenance OKR", "teamName": "team2", "roundId": 202201}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/new -H 'Content-Type: application/json' -d '{"description": "Maintenance OKR", "teamName": "team1", "roundId": 202202}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/new -H 'Content-Type: application/json' -d '{"description": "Maintenance OKR", "teamName": "team2", "roundId": 202202}'

# Create Objective
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/1/new_objective -H 'Content-Type: application/json' -d '{"title": "increase x from y to z", "description": "blah blah blah", "weight": 2}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/1/new_objective -H 'Content-Type: application/json' -d '{"title": "decrease x from y to z", "description": "blah blah blah", "weight": 3}'

curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/2/new_objective -H 'Content-Type: application/json' -d '{"title": "increase sell from y to z", "description": "blah blah blah", "weight": 4}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/2/new_objective -H 'Content-Type: application/json' -d '{"title": "increase x from y to z", "description": "blah blah blah", "weight": 4}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/2/new_objective -H 'Content-Type: application/json' -d '{"title": "increase x from y to z", "description": "blah blah blah", "weight": 2}'

curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/3/new_objective -H 'Content-Type: application/json' -d '{"title": "increase x from y to z", "description": "blah blah blah", "weight": 5}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/3/new_objective -H 'Content-Type: application/json' -d '{"title": "increase x from y to z", "description": "blah blah blah", "weight": 1}'

# Create KR
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/1/objectives/1/new_kr -H 'Content-Type: application/json' -d '{"title": "Task 1", "description": "Do something", "weight": 2}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/1/objectives/1/new_kr -H 'Content-Type: application/json' -d '{"title": "Task 2", "description": "Do something", "weight": 3}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/1/objectives/1/new_kr -H 'Content-Type: application/json' -d '{"title": "Task 3", "description": "Do something", "weight": 5}'

curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/1/objectives/2/new_kr -H 'Content-Type: application/json' -d '{"title": "Task 4", "description": "Do something", "weight": 1}'
curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/1/objectives/2/new_kr -H 'Content-Type: application/json' -d '{"title": "Task 5", "description": "Do something", "weight": 5}'

curl --cookie "access_token=$COOKIE" -X POST localhost:8000/api/okrs/2/objectives/3/new_kr -H 'Content-Type: application/json' -d '{"title": "Task 1", "description": "Do something", "weight": 1}'
