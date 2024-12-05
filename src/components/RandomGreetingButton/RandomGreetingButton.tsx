import React from "react";

const randomGreetings = [
  "haiii :3",
  "who goes there!",
  "ayoooooooooooooooo",
  "hi!",
  "hows it hangin",
  "waaaazzzzzaaaaaaa :D",
  "howdy partner",
  "greetings earthling",
  "if youre reading this, i am stuck in the backrooms please let me out",
  "hello there",
  "hola",
  "bonjour",
  "hej!",
  "hows its going bros its ya boi",
  "greetings, traveler",
  "heads up guardian! the moon is haunted...",
  "hello, world",
  "****CLICK HERE FOR FREE V-BUCKS**** (jk)",
  "do you ever just feel like a plastic bag? drifting through the wind? wanting to start again?",
  "i like pineapples on my pizza",
  "[insert generic greeting here]",
  "itd be so crazy if you clicked me and i did a backflip",
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
      <button className="flex w-full" onClick={getRandomGreeting}>
        ✨ <span className="pl-1 hover:underline">{greeting}</span>
      </button>
    </div>
  );
};

export default RandomGreetingButton;
