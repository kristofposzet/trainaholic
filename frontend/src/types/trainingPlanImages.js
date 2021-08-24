import React from 'react';
import Image from 'react-bootstrap/Image';
import dumbell from '../assets/images/trainingPlans/dumbell.PNG';
import exerciseMat from '../assets/images/trainingPlans/exerciseMat.PNG';
import ropes from '../assets/images/trainingPlans/ropes.PNG';
import smallWeights from '../assets/images/trainingPlans/smallWeights.PNG';
import weights from '../assets/images/trainingPlans/weights.PNG';
import weightGreen from '../assets/images/trainingPlans/weightGreenColor.PNG';
import singleWeight from '../assets/images/trainingPlans/weight.jpg';
import { IMAGE_ID_S } from './imageIdentifiers';

export const IMAGES = [
  <Image src={dumbell} thumbnail width={200} height={185} key={IMAGE_ID_S.dumbell} />,
  <Image src={exerciseMat} thumbnail width={200} height={185} key={IMAGE_ID_S.exerciseMat} />,
  <Image src={ropes} thumbnail width={200} height={185} key={IMAGE_ID_S.ropes} />,
  <Image src={smallWeights} thumbnail width={200} height={185} key={IMAGE_ID_S.smallWeights} />,
  <Image src={weightGreen} thumbnail width={200} height={185} key={IMAGE_ID_S.weightGreenColor} />,
  <Image src={weights} thumbnail width={200} height={185} key={IMAGE_ID_S.weights} />,
  <Image src={singleWeight} thumbnail width={200} height={185} key={IMAGE_ID_S.singleWeight} />,
];
