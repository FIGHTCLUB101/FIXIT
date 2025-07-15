export default async function moderateContent(message: string, image: string) {
  const text = `${message} ${image}`;
  const flaggedWords = ['fake', 'fraud', 'abuse']; // example
  const found = flaggedWords.filter(w => text.includes(w));
  return {
    status: found.length > 0 ? 'flagged' : 'approved',
    confidence: found.length > 0 ? 0.8 : 0.99,
  };
}
// aiModeration.ts placeholder
