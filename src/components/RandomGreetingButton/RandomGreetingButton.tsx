import React from "react";

const randomGreetings = [
  "haiii :3",
  "who goes there!",
  "ayoooooooooooooooo",
  "hi!",
  "hows it hangin",
  "waaaazzzzzaaaaaaa",
  "howdy partner",
  "greetings earthling",
  "if youre reading this, i am stuck in the backrooms please let me out",
  "hello there",
  "hola",
  "bonjour",
  "ciao",
  "hej!",
  "i am severely depressed",
  "hows its going bros its ya boi",
  "greetings from the void",
  "greeting hi thewarowl greets you",
  "*teleports behind you* pshh... nothin personnel... kid...",
  "greetings, traveler",
  "heads up guardian!",
  "the moon is haunted...",
  "TOP OF THE MORNING TO YA LADDIES",
  "hello everyone, my name is markiplier...just kidding",
  "greetings, fellow human",
  "hello, world",
  "if you can read this, you are in the matrix",
  "mr. anderson, we've been expecting you",
  "blue pill or red pill?",
  "hello, it's me",
  "i am groot",
  "hasta la vista, baby",
  "i'll be back",
  "i am not a robot",
  "i may be a robot",
  "ayo?",
  "ska-doosh",
  '"i am inevitable" -some purple dude',
  "JIN-YAAAAAAANNNNGGG!!!!!!!!!!!",
  "****CLICK HERE FOR FREE V-BUCKS**** (jk)",
  "itsa me, mario!",
  "do you ever just feel like a plastic bag?",
];

const RandomGreetingButton = () => {
  const [greeting, setGreeting] = React.useState(() => {
    const randomIndex = Math.floor(Math.random() * randomGreetings.length);
    return randomGreetings[randomIndex];
  });
  const [lastFive, setLastFive] = React.useState<string[]>([]);

  const getRandomGreeting = () => {
    let newGreeting;
    let attempts = 0;

    do {
      const randomIndex = Math.floor(Math.random() * randomGreetings.length);
      newGreeting = randomGreetings[randomIndex];
      attempts++;
    } while (lastFive.includes(newGreeting) && attempts < 100);

    setGreeting(newGreeting);
    setLastFive((prevLastFive) => {
      const updatedLastFive = [...prevLastFive, newGreeting];
      if (updatedLastFive.length > 10) {
        updatedLastFive.shift();
      }
      return updatedLastFive;
    });
  };

  return (
    <div className="hover:cursor-none generic-hover">
      <button
        className="flex w-full hover:underline"
        onClick={getRandomGreeting}
      >
        {greeting}
      </button>
    </div>
  );
};

export default RandomGreetingButton;
