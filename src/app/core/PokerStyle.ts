const POKER_STR = 'abcdefghijklm';

function sort(cards: string []): string[] {
  let temp = '';
  // 排序
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i] > cards[j]) {
        temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
      }
    }
  }
  return cards;
}

interface IPokerStyle {
  init(): void;
  isStraight(str?: string): number;
}

export class PokerStyle implements IPokerStyle {
  cards: string[] = [];
  flushObj = {
    1: [],
    2: [],
    3: [],
    4: [],
  };
  straightArr: string[] = [];
  pokerStyle: string[] = [ '0', '0', '0', '0', '0', '0', '0', '0' ];
  numObj: Map<string, number> = new Map(
    POKER_STR.split('').map(m => [ m, 0 ]));

  constructor(commonCards: string[], handCards: string[]) {
    const cards = [ ...commonCards, ...handCards ];
    this.cards = sort(cards);
    this.init();
  }

  init() {
    let i = 0;
    const isTwo = [];
    const isThree = [];
    let isFour = '0';
    let isFullHouse = '0';
    let isStraightFlush = '0';
    let isFlush = [];
    let isRoyalFlush = '0';
    let isThreeKind = '';
    let isTowPair = '';
    let isPair = '';
    const highCard = [];

    while (i < this.cards.length) {
      const color = this.cards[i][1];
      const num = this.cards[i][0];
      this.straightArr.push(this.cards[i][0]);
      this.flushObj[color].push(num);
      let value = this.numObj.get(num) || 0;
      value++;
      this.numObj.set(num, value);
      i++;
    }

    // find flush
    for (const f in this.flushObj) {
      if (this.flushObj[f].length >= 5) {
        // flush is order,so flush[length - 1] is max flush card
        isFlush = this.flushObj[f];
      }
    }

    // find two,three,four
    for (const [ key, value ] of this.numObj) {
      // high card
      if (value === 1) {
        highCard.unshift(key);
      }
      // pairs max count 3, source is small to large
      if (value >= 2) {
        isTwo.unshift(key);
      }
      // three of kind max count 2
      if (value === 3) {
        isThree.unshift(key);
      }
      // four of kind only one
      if (value === 4) {
        isFour = key;
      }
    }
    // straight flush
    if (isFlush.length !== 0 && this.isStraight(isFlush) > -1) {
      if (this.isStraight(isFlush) === 8) {
        isRoyalFlush = '1';
        this.pokerStyle[0] = isRoyalFlush;
        return;
      }
      isStraightFlush = '1' + this.isStraight(isFlush);
      this.pokerStyle[1] = isStraightFlush;
      return;
    }

    // four of kind
    if (isFour !== '0') {
      isFour += highCard[0];
      this.pokerStyle[2] = isFour;
      return;
    }

    // full house
    if (isThree.length > 0 && isTwo.length > isThree.length || isThree.length === 2) {
      const maxTwoCard = isThree.length === 2 ? isThree[1] : isThree[0] === isTwo[0] ? isTwo[1] : isTwo[0];
      const maxThree = isThree[0];
      isFullHouse = maxThree + maxTwoCard;
      this.pokerStyle[3] = isFullHouse;
      return;
    }

    // three of kind
    if (isThree.length > 0) {
      isThreeKind = isThree.join('');
      isThreeKind += highCard[0] + highCard[1];
      this.pokerStyle[4] = isThreeKind;
      return;
    }
    // tow pair
    if (isTwo.length >= 2) {
      isTowPair = isTwo.join('');
      // third tow pair card big then high card
      const highCardForTowPair = isTwo[3] && isTwo[3] > highCard[0] ? isTwo[3] : highCard[0];
      isTowPair += highCardForTowPair;
      this.pokerStyle[5] = isTowPair;
      return;
    }
    // pair
    if (isTwo.length === 1) {
      isPair = isTwo.join('');
      isPair += highCard[0] + highCard[1] + highCard[2];
      this.pokerStyle[6] = isPair;
      return;
    }
    // High card
    this.pokerStyle[7] = highCard.join('');
  }

  isStraight(str?: string): number {
    const straightStr = str || [ ...new Set(this.straightArr) ].join('');
    let first = -1;
    let second = -1;
    let three = -1;
    if (straightStr.length === 5) {
      return POKER_STR.indexOf(straightStr);
    }
    if (straightStr.length === 6) {
      first = POKER_STR.indexOf(straightStr.slice(0, 4));
      second = POKER_STR.indexOf(straightStr.slice(1, 5));
      return Math.max(first, second);
    }
    if (straightStr.length === 7) {
      first = POKER_STR.indexOf(straightStr.slice(0, 4));
      second = POKER_STR.indexOf(straightStr.slice(1, 5));
      three = POKER_STR.indexOf(straightStr.slice(2, 6));
      return Math.max(first, second, three);
    }
    return -1;
  }

  getPokerWeight() {
    return this.pokerStyle.join('');
  }
}
