import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Excluir Pokémon',
    message: 'Tem certeza que deseja excluir Pikachu?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar quando isOpen=true', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Excluir Pokémon')).toBeInTheDocument();
    expect(
      screen.getByText('Tem certeza que deseja excluir Pikachu?'),
    ).toBeInTheDocument();
  });

  it('não deve renderizar quando isOpen=false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Excluir Pokémon')).not.toBeInTheDocument();
  });

  it('deve chamar onConfirm ao clicar em Excluir', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Excluir'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onCancel ao clicar em Cancelar', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar estado de loading', () => {
    render(<ConfirmModal {...defaultProps} isLoading />);
    expect(screen.getByText('Excluindo...')).toBeInTheDocument();
  });
});
