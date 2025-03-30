import React from 'react';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Post.module.css';
import footerStyles from '../../styles/Footer.module.css';
import Link from 'next/link';

export default function BlogPost7() {
  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.blogContent}>
          <h2 style={{ margin: 0 }}>Retro Run – A Memory Game Inspired by My Gaming Roots
          <Link href="/memory-game" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '.5em' }}>
          Try &#10138; {/* Right arrow symbol */}
          </Link></h2>
        <p className={styles.date}>Published on March 30, 2025</p>

        <h3>Introduction</h3>
        <p>
          As a kid, I was glued to screens—joysticks in hand, eyes wide with wonder—playing games that weren’t just fun but sparked something deeper. That obsession with gaming didn’t just pass the time; it set me on a path to computer science. Today, I’ve channeled that nostalgia into Retro Run, a memory game where you match cards featuring classics like Pong, Pac-Man, and Super Mario Bros. It starts with a simple 2x2 grid and ramps up to a challenging 12x12. It’s a tribute to the games that shaped me, and I’m excited to share how they led me here—plus a peek at the code behind it.
        </p>

        <h3>Gaming: My Childhood Obsession</h3>
        <p>
          Growing up, gaming wasn’t just a hobby—it was a world I couldn’t get enough of. I’d spend hours dodging ghosts in Pac-Man, jumping barrels in Super Mario Bros., or blasting aliens in Space Invaders. Each game was a puzzle, a challenge, a story—and I was hooked. I’d wonder: How do these worlds come to life? That curiosity about the how behind the pixels drove me to tinker with computers, learn to code, and eventually dive into computer science. Those late nights chasing high scores weren’t wasted—they were the foundation of who I am today, a developer building my own digital creations.
        </p>

        <h3>Retro Run: A Nostalgic Twist</h3>
        <p>
          Retro Run is my love letter to those classics. It’s a memory game that begins with an easy 2x2 grid—just 2 pairs to match—and scales all the way to a massive 12x12, testing your memory with 72 pairs. The cards feature artwork from the games that inspired me, so every flip is a trip down memory lane—Pong’s simple paddles, Tetris’s falling blocks, or Minecraft’s pixelated landscapes. I picked 15 iconic titles from my childhood, each a milestone in gaming history and a personal touchstone that fueled my passion for tech.
        </p>
        <ul>
          <li><strong>Pong (1972) – Atari</strong>: The game that started it all, with its basic yet addictive ping-pong action.</li>
          <li><strong>Space Invaders (1978) – Taito</strong>: My first taste of defending Earth from pixelated invaders.</li>
          <li><strong>Pac-Man (1980) – Namco</strong>: Chasing dots and ghosts taught me strategy.</li>
          <li><strong>Super Mario Bros. (1985) – Nintendo</strong>: Mario’s jumps made me dream of building worlds.</li>
          <li><strong>The Legend of Zelda (1986) – Nintendo</strong>: Exploring Hyrule ignited my love for adventure.</li>
          <li><strong>Tetris (1989 – Game Boy)</strong>: Puzzle perfection on the go—hours vanished!</li>
          <li><strong>Street Fighter II (1991) – Capcom</strong>: Hadoukens and combos fueled my competitive streak.</li>
          <li><strong>Doom (1993) – id Software</strong>: Running and gunning in 3D blew my mind.</li>
          <li><strong>Pokémon Red & Blue (1996) – Nintendo</strong>: Catching ‘em all was my first RPG obsession.</li>
          <li><strong>Grand Theft Auto III (2001) – Rockstar Games</strong>: Freedom in an open world felt limitless.</li>
          <li><strong>Halo: Combat Evolved (2001) – Bungie</strong>: Master Chief made me a console FPS fan.</li>
          <li><strong>World of Warcraft (2004) – Blizzard</strong>: Guilds and quests showed me online community power.</li>
          <li><strong>Minecraft (2009) – Mojang</strong>: Building anything imaginable hooked me again.</li>
          <li><strong>The Elder Scrolls V: Skyrim (2011) – Bethesda</strong>: Dragons and mods deepened my love for exploration.</li>
          <li><strong>Fortnite (2017) – Epic Games</strong>: Battle royale chaos kept the excitement alive.</li>
        </ul>

        <h3>Key Code Behind Retro Run</h3>
        <p>
          Building Retro Run was a blast—here are a few key snippets from `memory-game.js` that make it tick with the new 2x2 to 12x12 range:
        </p>

        <h3>Randomizing the Cards</h3>
        <pre>
          <code>
{`const generateCards = (size) => {
  const pairCount = (size * size) / 2;
  const shuffledPool = shuffleArray([...imagePool]);
  const selectedImages = shuffledPool.slice(0, pairCount);
  const cards = [...selectedImages, ...selectedImages];
  return shuffleArray(cards).map((img, index) => ({
    id: index,
    image: img,
    isFlipped: false,
    isMatched: false,
  }));
};`}
          </code>
        </pre>
        <p>
          This function pulls random game images—like Pong or Doom—from my classics list, duplicates them for pairs, and shuffles them. For a 2x2 grid, it grabs 2 images; for 12x12, it scales to 72. Every start or refresh gets a fresh mix, keeping the nostalgia alive and unpredictable.
        </p>

        <h3>Flipping and Matching</h3>
        <pre>
          <code>
{`const handleCardClick = (clickedCard) => {
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
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.image === clickedCard.image ? { ...card, isMatched: true, isFlipped: true } : card
        )
      );
      setFlippedCards([]);
    } else {
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
};`}
          </code>
        </pre>
        <p>
          Click a card, it flips—pick two, and if they match (two Marios), they stay; if not (Mario and Zelda), they flip back after a second. This logic scales from 2x2’s quick wins to 12x12’s brain-bending challenge, echoing the thrill of my old gaming days.
        </p>

        <h3>Leveling Up</h3>
        <pre>
          <code>
{`const levels = [2, 4, 6, 8, 10, 12]; // Grid sizes from 2x2 to 12x12

const handleNextLevel = () => {
  if (level < levels.length - 1) {
    setLevel(level + 1);
  } else {
    alert('You’ve conquered all levels! Great job!');
  }
};

const resetGameForLevel = (newLevel) => {
  setCards(generateCards(levels[newLevel]));
  setFlippedCards([]);
  setMoves(0);
  setGameWon(false);
};`}
          </code>
        </pre>
        <p>
          Start small at 2x2, win, and `handleNextLevel` pushes you to 4x4, up to 12x12. `resetGameForLevel` refreshes the grid with new random cards—2 pairs at first, 72 at the end—mirroring how those classic games kept me hooked with growing challenges.
        </p>

        <h3>From Player to Creator</h3>
        <p>
          Gaming as a kid wasn’t just play—it was a gateway. Pong’s simplicity made me wonder about code. Doom’s 3D worlds pushed me to explore graphics. Minecraft’s endless possibilities taught me creativity in tech. Each game planted a seed, and Retro Run is the harvest—a memory game that’s both a nod to my past and a showcase of what I’ve learned. It’s wild to think those hours mashing buttons led me to build tools like this today.
        </p>

        <h3>Conclusion</h3>
        <p>
          Retro Run blends nostalgia with coding joy, turning my childhood gaming obsession into something you can play—from a breezy 2x2 to a daunting 12x12. From Pong to Fortnite, these classics didn’t just entertain me—they inspired a career in computer science. Try it out, flip some cards, and let me know what you think—or share your own gaming memories! It’s live at <Link href="/memory-game">RetroRun</Link>, ready for a retro challenge.
        </p>
      </section>

      <footer className={footerStyles.footer}>
        <Link href="/about">About Me</Link>
      </footer>
    </div>
  );
}