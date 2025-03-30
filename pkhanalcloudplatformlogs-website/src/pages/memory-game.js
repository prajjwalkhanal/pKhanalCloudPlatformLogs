import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/MemoryGame.module.css';
import footerStyles from '../styles/Footer.module.css';
import Link from 'next/link';

const imagePool = [
  '/images/card1.jpg',
  '/images/card2.jpg',
  '/images/card3.jpg',
  '/images/card4.jpg',
  '/images/card5.jpg',
  '/images/card6.jpg',
  '/images/card7.jpg',
  '/images/card8.jpg',
  '/images/card9.jpg',
  '/images/card10.jpg',
  '/images/card11.jpg',
  '/images/card12.jpg',
  '/images/card13.jpg',
  '/images/card14.jpg',
  '/images/card15.jpg',
];


const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const generateCards = (size) => {
  const pairCount = (size * size) / 2;
  // Shuffle the entire imagePool and take the first pairCount images
  const shuffledPool = shuffleArray([...imagePool]);
  const selectedImages = shuffledPool.slice(0, pairCount);
  const cards = [...selectedImages, ...selectedImages]; // Duplicate for pairs
  return shuffleArray(cards).map((img, index) => ({
    id: index,
    image: img,
    isFlipped: false,
    isMatched: false,
  }));
};

export default function MemoryGame() {
  const levels = [2, 4, 6, 8, 10, 12]; // Grid sizes: 2x2, 4x4, 6x6, 8x8, 10x10 , 12x12
  const [level, setLevel] = useState(0); // Start at 2x2 (index 0)
  const [cards, setCards] = useState([]); // Start empty, populate in useEffect
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Reset cards when level changes or page loads
  const resetGameForLevel = (newLevel) => {
    setCards(generateCards(levels[newLevel]));
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  // Run on mount and when level changes
  useEffect(() => {
    resetGameForLevel(level);
  }, [level]);

  useEffect(() => {
    const allMatched = cards.every((card) => card.isMatched);
    if (allMatched && cards.length > 0) {
      setGameWon(true);
    }
  }, [cards]);

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length >= 2 || clickedCard.isFlipped || clickedCard.isMatched) return;

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, clickedCard]);

    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      const firstCard = flippedCards[0];
      if (firstCard.image === clickedCard.image) {
        // Match found
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.image === clickedCard.image ? { ...card, isMatched: true, isFlipped: true } : card
          )
        );
        setFlippedCards([]);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === clickedCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleNextLevel = () => {
    if (level < levels.length - 1) {
      setLevel(level + 1);
    } else {
      alert('You’ve conquered all levels! Great job!');
    }
  };

  const handleReset = () => {
    setLevel(0); // Reset to 4x4
    resetGameForLevel(0); // Immediately reset with new cards
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.gameContent}>
        <h1>Retro Run</h1>
        <p>Match the pairs! Start with 2x2 and work your way up.</p>
        <div className={styles.stats}>
          <p>Level: {levels[level]}x{levels[level]}</p>
          <p>Moves: {moves}</p>
        </div>

        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${levels[level]}, 100px)`,
            width: `${levels[level] * 110}px`, // Adjust for card size + margin
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={`${styles.card} ${card.isFlipped || card.isMatched ? styles.flipped : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardBack}>?</div>
                <div className={styles.cardFront}>
                  <img src={card.image} alt="card" className={styles.cardImage} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {gameWon && (
          <div className={styles.winMessage}>
            <p>You’ve won this level!</p>
            {level < levels.length - 1 ? (
              <button onClick={handleNextLevel} className={styles.button}>
                Next Level ({levels[level + 1]}x{levels[level + 1]})
              </button>
            ) : (
              <p>You’re a memory master!</p>
            )}
            <button onClick={handleReset} className={styles.button}>
              Play Again
            </button>
          </div>
        )}
      </section>

      <footer className={footerStyles.footer}>
        <Link href="/about">About Me</Link>
      </footer>
    </div>
  );
}