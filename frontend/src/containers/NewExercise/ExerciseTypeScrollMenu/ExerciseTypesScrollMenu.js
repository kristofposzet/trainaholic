import React, { useEffect, useState } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import PropTypes from 'prop-types';
import './ExerciseTypesScrollMenu.css';

import NewExercise from '../NewExercise';
import Menu from './MapMenuItems';
import EXERCISE_GROUP from '../../../types/exerciseGroup';
import AbsEn from '../../../assets/images/absEN.jpg';
import AbsHu from '../../../assets/images/absHU.jpg';
import BackEn from '../../../assets/images/backEN.jpg';
import BackHu from '../../../assets/images/backHU.jpg';
import BicepsEn from '../../../assets/images/bicepsEN.jpg';
import BicepsHu from '../../../assets/images/bicepsHU.jpg';
import ChestEn from '../../../assets/images/chestEN.jpg';
import ChestHu from '../../../assets/images/chestHU.jpg';
import HandEn from '../../../assets/images/handEN.jpg';
import HandHu from '../../../assets/images/handHU.jpg';
import TricepsEn from '../../../assets/images/tricepsEN.jpg';
import TricepsHu from '../../../assets/images/tricepsHU.jpg';
import LegEn from '../../../assets/images/legEN.jpg';
import LegHu from '../../../assets/images/legHU.jpg';
import ShoulderEn from '../../../assets/images/shoulderEN.jpg';
import ShoulderHu from '../../../assets/images/shoulderHU.jpg';
import OtherEn from '../../../assets/images/otherEN.jpg';
import OtherHu from '../../../assets/images/otherHU.jpg';
import TrainingPlanNavigation from '../../../components/Navigation/TrainingPlans/TrainingPlanNavigation';

const listEN = [
  { img: ChestEn, id: 'chestEn', group: EXERCISE_GROUP.chest },
  { img: AbsEn, id: 'absEn', group: EXERCISE_GROUP.abs },
  { img: BicepsEn, id: 'bicepsEN', group: EXERCISE_GROUP.biceps },
  { img: BackEn, id: 'backEN', group: EXERCISE_GROUP.back },
  { img: TricepsEn, id: 'tricepsEN', group: EXERCISE_GROUP.triceps },
  { img: LegEn, id: 'legEN', group: EXERCISE_GROUP.leg },
  { img: ShoulderEn, id: 'shoulderEN', group: EXERCISE_GROUP.shoulder },
  { img: HandEn, id: 'handEN', group: EXERCISE_GROUP.hand },
  { img: OtherEn, id: 'otherEN', group: EXERCISE_GROUP.other },
];

const listHU = [
  { img: ChestHu, id: 'chestHu', group: EXERCISE_GROUP.chest },
  { img: AbsHu, id: 'absHu', group: EXERCISE_GROUP.abs },
  { img: BicepsHu, id: 'bicepsHu', group: EXERCISE_GROUP.biceps },
  { img: BackHu, id: 'backHu', group: EXERCISE_GROUP.back },
  { img: TricepsHu, id: 'tricepsHU', group: EXERCISE_GROUP.triceps },
  { img: LegHu, id: 'legHU', group: EXERCISE_GROUP.leg },
  { img: ShoulderHu, id: 'shoulderHU', group: EXERCISE_GROUP.shoulder },
  { img: HandHu, id: 'handHU', group: EXERCISE_GROUP.hand },
  { img: OtherHu, id: 'otherHU', group: EXERCISE_GROUP.other },
];

const Arrow = ({ text, className }) => (
  <div className={className}>
    {text}
  </div>
);

const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

const exerciseTypesScrollMenu = (props) => {
  const [selected, setSelected] = useState('');
  const [language, setLanguage] = useState('hu');
  const [menuItems, setMenuItems] = useState(Menu(listHU, 'hu'));

  useEffect(() => {
    setLanguage(props.language);
    if (props.language === 'hu') {
      setMenuItems(Menu(listHU, selected));
    } else {
      setMenuItems(Menu(listEN, selected));
    }
  }, [props.language]);

  const onSelect = (key) => {
    setSelected(key);
  };

  return (
    <div style={{ marginTop: '28px' }}>
      <TrainingPlanNavigation />
      <div style={{ marginTop: '35px' }}>
        <ScrollMenu
          data={menuItems}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={selected}
          onSelect={onSelect}
          alignCenter={false}
        />
        <NewExercise
          selected={language === 'hu' // mindegyik listaelememnek van id-ja, ez a key, amikor kirajzolom
            // a MenuItem-eket, tovabba, ha mas kepre klikkelek, akkor ez az id valtozik a state-en
            // belul. Mivel nekem szuksegem lesz a groupra, amit mar collectionben (e. type)taroltam
            // korabban, id szerint megkeresem a groupot es mivel obj-ot nem adhatok at, reduce-olok
            ? listHU.filter((elem) => elem.id === selected).reduce((prevVal, newVal) => newVal.group, '')
            : listEN.filter((elem) => elem.id === selected).reduce((prevVal, newVal) => newVal.group, '')}
        />
      </div>
    </div>
  );
};

Arrow.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

exerciseTypesScrollMenu.propTypes = {
  language: PropTypes.string,
};

exerciseTypesScrollMenu.defaultProps = {
  language: null,
};

Arrow.defaultProps = {
  text: null,
  className: null,
};

export default exerciseTypesScrollMenu;
