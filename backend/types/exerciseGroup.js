// a gyakorlatok tipusait egyfajta enumkent reprezentalom, mert nem szeretnem, hogy valtozzon

const exerciseGroup = {
  chest: 'chest1',
  abs: 'abs2',
  biceps: 'biceps3',
  back: 'back4',
  triceps: 'triceps5',
  leg: 'leg6',
  shoulder: 'shoulder7',
  hand: 'hand8',
  other: 'other9',
};

module.exports = Object.freeze(exerciseGroup);
