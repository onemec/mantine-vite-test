import React, { useEffect, useState } from 'react';
import { Board, Difficulty, generate } from 'sudoku-core';
import { Box, Button, Center, Container, Paper, PinInput, Select, SimpleGrid } from '@mantine/core';
import { Welcome } from '@/components/Welcome/Welcome';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

export function HomePage(): React.JSX.Element {
  const [board, setBoard] = useState<(number | null)[][]>([[], [], [], [], [], [], [], [], []]);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  useEffect((): void => {
    generateBoard();
  }, []);

  const generateBoard = (): void => {
    const generatedBoard: Board = generate(difficulty);
    const formattedBoard: (number | null)[][] = formatBoard(generatedBoard);
    setBoard(formattedBoard);
  };

  const formatBoard = (generatedBoard: Board) =>
    Array.from({ length: 9 }, (_, i) => generatedBoard.slice(i * 9, i * 9 + 9));

  const renderQuadrant = (quadrantIndex: number) => {
    const quadrantCells: (number | null)[] = Array.from({ length: 9 }, (_, index) => {
      const row: number = Math.floor((quadrantIndex * 3 + index) / 9);
      const col: number = (quadrantIndex * 3 + index) % 9;
      return board[row][col];
    });

    return (
      <Paper key={quadrantIndex} bg="#e9ecef" style={{ width: 'fit-content' }}>
        <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
          {quadrantCells.map((cell: number | null, index: number) => (
            <div key={index}>
              <PinInput
                size="lg"
                length={1}
                placeholder=""
                type="number"
                value={cell !== null ? String(cell) : ''}
              />
            </div>
          ))}
        </SimpleGrid>
      </Paper>
    );
  };

  const renderBoard = () => (
    <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
      {Array.from({ length: 9 }, (_, index: number) => renderQuadrant(index))}
    </SimpleGrid>
  );

  const handleDifficultyChange = (value: string | null): void => {
    if (value) {
      setDifficulty(value as Difficulty);
    }
  };

  const handleGenerateClick = (): void => {
    generateBoard();
  };

  return (
    <>
      <Welcome />
      <Container>
        <Center maw={850} bg="var(--mantine-color-gray-light)">
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Select
              value={difficulty}
              onChange={(value: string | null) => handleDifficultyChange(value)}
              data={[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
                { value: 'expert', label: 'Expert' },
                { value: 'master', label: 'Master' },
              ]}
              style={{ marginRight: '1rem' }}
            />
            <Button onClick={handleGenerateClick}>Generate</Button>
          </Box>
          {renderBoard()}
        </Center>
      </Container>
      <ColorSchemeToggle />
    </>
  );
}
