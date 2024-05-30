// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   res.status(200).json({ name: "John Doe" });
// }

export default async function handler(req, res) {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();

  res.status(200).json(data);
}
