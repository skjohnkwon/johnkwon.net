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
  "greetings from the void :3",
  "*teleports behind you* pshh... nothin personal kid...",
  "greetings, traveler",
  "heads up guardian! the moon is haunted...",
  "TOP OF THE MORNING TO YA LADDIES",
  "hello everyone, my name is markiplier...just kidding",
  "greetings, fellow human",
  "hello, world",
  "if you can read this, you are in the matrix >:3",
  "mr. anderson, we've been expecting you",
  "blue pill or red pill?",
  "hello, it's me",
  "i am groot",
  "i am not a robot",
  "i may be a robot",
  "ayo?",
  "ska-doosh -some panda dude",
  '"i am inevitable" -some purple dude',
  "****CLICK HERE FOR FREE V-BUCKS**** (jk)",
  "itsa me, mario! -some plumber dude",
  "do you ever just feel like a plastic bag? drifting through the wind? wanting to start again?",
  "i like pineapples on my pizza",
  "[insert generic greeting here]",
  "itd be so crazy if you clicked me and i did a backflip",
  "JUST DO IT! -adidas or something",
  "but we friends tho",
  "skibidi sigma fanum tax with rizz",
  "too bad you cant click me... oh wait",
  "i may be a button, but you are the real button :) <3",
  "pitbull should be president imho",
  '"dont move! im a professional" -some guy who isnt a professional',
  "i think groot should have died instead of tony stark, i mean he can just grow back right?",
  "billionaire, playboy, philanthropist",
  "charles xavier is a dumbass, change my mind",
  "copilot hit the swe community like crack did in low income neighborhoods",
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
        ✨ <span className="hover:underline">{greeting}</span>
      </button>
    </div>
  );
};

export default RandomGreetingButton;
