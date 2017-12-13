const doors = {
  gold: 'gold',
  trash: 'trash',
};

function random(lower, upper) {
  return lower + Math.floor(Math.random() * ((upper - lower) + 1));
}

function shuffleArray(array) {
  const newArray = [...array];
  let index = 0;
  while (index < newArray.length) {
    const rand = random(index, newArray.length - 1);
    [newArray[rand], newArray[index]] = [newArray[index], newArray[rand]];
    index += 1;
  }
  return newArray;
}

class Game {
  constructor(doorsCount) {
    this.doors = shuffleArray([doors.gold, ...new Array(doorsCount - 1).fill(doors.trash)]);
  }

  chooseDoor(index) {
    this.chosenDoorIndex = index;
  }

  isPlayerWon() {
    return this.doors[this.chosenDoorIndex] === doors.gold;
  }
}

function doGame(gamesCount, doorsCount) {
  let successfulGamesWithoutDoorSwitching = 0;
  let successfulGamesWithDoorSwitching = 0;
  for (let i = 0; i < gamesCount; i += 1) {
    const game = new Game(doorsCount);

    game.chooseDoor(random(0, doorsCount - 1));
    if (game.isPlayerWon()) {
      successfulGamesWithoutDoorSwitching += 1;
    } else {
      successfulGamesWithDoorSwitching += 1;
    }
  }
  document.querySelector('p:first-of-type span').innerHTML = successfulGamesWithoutDoorSwitching;
  document.querySelector('p:last-of-type span').innerHTML = successfulGamesWithDoorSwitching;
}
