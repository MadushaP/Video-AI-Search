import { promises as fs } from 'fs';
import path from 'path'; // For handling file paths

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'data.json'); // Adjust path as needed
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(jsonData);

  return {
    props: {
      data,
    },
  };
}
