import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react'; // eslint-disable-line
import '@testing-library/jest-dom/extend-expect'; // eslint-disable-line
import BookCard from './index';

const book = {
  author: { avatar: 'http://lorempixel.com/250/250/', name: 'Author name' },
  cover: 'http://lorempixel.com/500/700/',
  description: 'Book description',
  genre: { category: 'Non-Fiction', name: 'History' },
  id: '123',
  introduction:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus pretium ante, eu condimentum nulla pretium nec. Nunc lacus ligula, tincidunt eu diam non, varius viverra tortor. Sed interdum arcu id molestie cursus. Sed vel pharetra enim. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas vitae nisl faucibus, auctor tortor nec, finibus nunc. Maecenas vel orci facilisis, consectetur libero nec, faucibus purus. Vivamus sed sapien in dui tempor lacinia. Vestibulum at tempus ligula. Nam at sem sed velit venenatis tempor.Integer pretium quam et venenatis pellentesque. Vivamus non congue risus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque purus nisi, facilisis et imperdiet et, consectetur nec sapien. Fusce lobortis non felis eu volutpat. Aliquam eget dapibus eros, in ultricies dui. Etiam quis ante a tortor fermentum eleifend ac nec elit.Curabitur ultrices accumsan purus, at sagittis dolor. Etiam eleifend scelerisque mi eu dapibus. Cras ut turpis vestibulum, varius nisl vel, sodales ante. Quisque vulputate dignissim felis. Pellentesque sagittis ultricies erat at dictum. Nam augue metus, efficitur id feugiat eu, lobortis scelerisque turpis. Donec maximus, dolor quis lacinia iaculis, lacus libero condimentum tortor, id porttitor quam tortor nec massa. Ut dignissim nibh ante, id suscipit turpis blandit in. Nam mauris dolor, eleifend nec consequat placerat, tempor in neque. Nulla semper, arcu nec ultrices mattis, nibh mauris ornare mauris, eu tristique nibh neque sit amet justo. Praesent sollicitudin in tortor ac iaculis. Nunc non eros urna.Donec at tempus augue. Sed nec efficitur arcu. Nam eu aliquet felis, vitae feugiat mauris. Integer eget quam nec ligula venenatis aliquet. Cras aliquam odio quis orci elementum, vitae interdum dui efficitur. Vivamus sed nisi lorem. Mauris varius, augue at pellentesque laoreet, turpis metus viverra urna, id vulputate erat lacus a diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras vitae blandit arcu. Proin rutrum ante nisi, et porttitor lectus egestas at. Donec sit amet pharetra neque. Interdum et malesuada fames ac ante ipsum primis in faucibus.Sed feugiat metus arcu, quis porttitor mauris cursus et. In eget interdum justo, nec commodo dui. In hac habitasse platea dictumst. Quisque eget ipsum non lectus mattis efficitur non et est. Suspendisse vehicula massa venenatis sodales commodo. Donec commodo pellentesque felis, a bibendum turpis mattis ut. Cras volutpat quam vitae cursus elementum.',
  likes: 816,
  name: 'Book Name',
  published: '2018-09-18T01:59:14.918Z'
};

function getDateForDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

describe('BookCard', () => {
  afterEach(cleanup);

  let handleViewDetails;
  let handleLike;

  beforeEach(() => {
    handleViewDetails = jest.fn();
    handleLike = jest.fn();
  });

  afterEach(cleanup);

  test('calls the "onLike" prop', () => {
    const wrapper = render(
      <BookCard book={book} onViewDetails={handleViewDetails} onLike={handleLike} />
    );

    fireEvent.click(wrapper.getByTestId('like-button'));
    expect(handleLike).toHaveBeenCalledTimes(1);
  });

  test('calls the "onViewDetails" prop on click', () => {
    const wrapper = render(
      <BookCard book={book} onViewDetails={handleViewDetails} onLike={handleLike} />
    );

    fireEvent.click(wrapper.container.querySelector('.book-card'));
    expect(handleViewDetails).toHaveBeenCalledTimes(1);
  });

  test('renders the relative date', () => {
    const wrapper = render(
      <BookCard
        book={{ ...book, published: getDateForDaysAgo(180).toISOString() }}
        onViewDetails={handleViewDetails}
        onLike={handleLike}
      />
    );

    expect(wrapper.getByTestId('relative-date')).toHaveTextContent('6 months ago');
  });
});
