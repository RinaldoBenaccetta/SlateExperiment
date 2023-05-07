export async function fetchSynonyms(word) {
    /**
     * English only!
     */
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
    const data = await response.json();

    // console.log('syn : ', data);
    return data.map((entry) => entry.word);
  }