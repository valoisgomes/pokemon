import { render, screen } from '@testing-library/react';
import TypeBadge from '../TypeBadge';

describe('TypeBadge', () => {
  it('deve renderizar o tipo corretamente', () => {
    render(<TypeBadge type="Elétrico" />);
    expect(screen.getByText('Elétrico')).toBeInTheDocument();
  });

  it('deve aplicar cor correta para tipo Fogo', () => {
    const { container } = render(<TypeBadge type="Fogo" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-orange-500');
  });

  it('deve aplicar cor padrão para tipo desconhecido', () => {
    const { container } = render(<TypeBadge type="Desconhecido" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-gray-400');
  });

  it('deve aplicar classe small quando prop small=true', () => {
    const { container } = render(<TypeBadge type="Água" small />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('text-xs');
  });

  it('deve aplicar classe normal sem prop small', () => {
    const { container } = render(<TypeBadge type="Água" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('text-sm');
  });
});
