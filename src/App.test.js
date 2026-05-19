import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import siteContent from '../public/data/siteContent.json';
import projectContent from '../public/data/projects.json';

beforeEach(() => {
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(url.includes('siteContent') ? siteContent : projectContent),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders portfolio header', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: /leo dai/i })).toBeInTheDocument();
  expect(screen.getByText(/MS Computer Science student/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /skills/i })).toBeInTheDocument();
});

test('opens skill overlay from a skill button', async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole('button', { name: /python/i }));
  expect(screen.getByRole('dialog', { name: /python/i })).toBeInTheDocument();
  expect(screen.getAllByText(/Telemetry Collector/i).length).toBeGreaterThan(1);
});
