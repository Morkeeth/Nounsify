import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';



const Home = () => {
  const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenerating, setIsGenerating] = useState(false);
  const onChange = (event) => {
    setInput(event.target.value);
  }; 
  const generateAction = async () => {
    console.log('Generating...');
    if (isGenerating && retry === 0) return;
      setIsGenerating(true);
      const generateAction = async () => {
        console.log('Generating...');
      
        // Add this check to make sure there is no double click
        if (isGenerating && retry === 0) return;
      
        // Set loading has started
        setIsGenerating(true);
      
        if (retry > 0) {
          setRetryCount((prevState) => {
            if (prevState === 0) {
              return 0;
            } else {
              return prevState - 1;
            }
          });
      
          setRetry(0);
        }
      
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: JSON.stringify({ input }),
        });
      
        const data = await response.json();
      
        if (response.status === 503) {
          setRetry(data.estimated_time);
          return;
        }
      
        if (!response.ok) {
          console.log(`Error: ${data.error}`);
          setIsGenerating(false);
          return;
        }
      
        setImg(data.image);
        setIsGenerating(false);
      };
    const sleep = (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };
    useEffect( () => {
      if retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
      }
      console.log(`Trying again in ${retry} seconds.`);
      await sleep(retry * 1000);
      await generateAction();
    }
    if (retry === 0) {
      return;
    }
    runRetry();
  }, [retry];

    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });
      setRetry(0);
    }
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    if (response.status === 503) {
      setRetry(data.estimated_time);
      return;
    }

    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      return;
    }

    setImg(data.image);
  };

  return (
    <div className="root">
    <Head>
      <title>Generate based on Nouns | Nounsify</title>
    </Head>
    <div className="container">
      <div className="header">
        <div className="header-title">
          <h1>Generate based on Nouns</h1>
        </div>
        <div className="header-subtitle">
          <h2>
           prompt me babe
          </h2>
        </div>
  
        <div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  <div className="prompt-buttons">
    <a className="generate-button" onClick={generateAction}>
      <div className="generate">
        <p>Generate</p>
      </div>
    </a>
  </div>
        </div>
      </div>
    </div>
    <div className="badge-container grow">
      <a
        href="https://buildspace.so/builds/ai-avatar"
        target="_blank"
        rel="noreferrer"
      >
        <div className="badge">
          <Image src={buildspaceLogo} alt="buildspace logo" />
          <p>build with buildspace</p>
        </div>
      </a>
    </div>
  </div>
  );
};

export default Home
