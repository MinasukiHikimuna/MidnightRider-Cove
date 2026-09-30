import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { ExistingAnswersView } from "../ExistingAnswers";
import { NO_TREES, type TagTrees } from "../effectPreview";
import type { MediaReviewAction } from "../model";
import type { AnswerSummary } from "../performerAnswers";

const held = (id: number, name: string, count: number) => ({ id, name, count });
const answer = (id: string, tag: number, group?: string, tree?: number): MediaReviewAction => ({
  id,
  label: id,
  ...(group === undefined ? {} : { group }),
  steps: [
    { mode: "ADD", tagIds: [tag] },
    ...(tree === undefined ? [] : [{ mode: "REMOVE_TREE" as const, tagIds: [tree] }]),
  ],
});
const show = (summary: AnswerSummary, actions: MediaReviewAction[], trees: TagTrees = NO_TREES) =>
  render(
    <ExistingAnswersView
      summary={summary}
      error=""
      mediaKind="video"
      actions={actions}
      trees={trees}
    />,
  );
/** The Mixed badge on the row of this name. */
const badge = (row: string) => {
  const group = screen.getByRole("list", { name: row }).closest<HTMLElement>(".dq-answer-group");
  return within(group!).getByText("Mixed");
};

// A category holding several answers at once (no answer removes its tree): tags 31 and 32 answer
// one question, 33 and 34 another.
const shape: AnswerSummary = {
  answered: 6,
  groups: [
    {
      id: 30,
      name: "Shape",
      members: [30, 31, 32, 33, 34],
      tags: [held(31, "Round", 3), held(33, "Thin", 2), held(32, "Square", 1), held(34, "Wide", 1)],
    },
  ],
};
const width = [answer("thin", 33, "Width"), answer("wide", 34, "Width")];

it("leaves out a group name that is the row's own, whatever its case", () => {
  // As Add from parent tags names the group: after the parent, which is the category.
  show(shape, [answer("round", 31, "shape"), answer("square", 32, "SHAPE")]);
  expect(badge("Shape")).toHaveTextContent(/^Mixed$/);
  expect(badge("Shape")).toHaveAttribute(
    "title",
    "This performer has different answers in this category.",
  );
});

it("names the other groups a row is mixed in, and says so when its own name was left out", () => {
  const view = show(shape, width);
  expect(badge("Shape")).toHaveTextContent(/^Mixed in Width$/);
  expect(badge("Shape")).toHaveAttribute("title", "This performer has different answers in Width.");
  view.unmount();
  // In words every reader gets, not in the tooltip alone.
  show(shape, [answer("round", 31, "Shape"), answer("square", 32, "Shape"), ...width]);
  expect(badge("Shape")).toHaveTextContent(/^Mixed here and in Width$/);
  expect(badge("Shape")).toHaveAttribute(
    "title",
    "This performer has different answers in this category and in Width.",
  );
});

it("names no category around or beside the row in the badge, only in its tooltip", () => {
  // Body takes one answer, its answers removing its tree; Size inside it holds several at once,
  // and the Width group inside Size holds the performer's two sizes, which Body speaks for.
  const body: AnswerSummary = {
    answered: 5,
    groups: [
      {
        id: 20,
        name: "Body",
        members: [20, 30, 31, 32, 40],
        tags: [held(32, "Medium", 3), held(40, "Tall", 2), held(31, "Small", 1)],
      },
      {
        id: 30,
        name: "Size",
        members: [30, 31, 32],
        tags: [held(32, "Medium", 3), held(31, "Small", 1)],
      },
    ],
  };
  show(body, [
    answer("tall", 40, undefined, 20),
    answer("small", 31, "Width"),
    answer("medium", 32, "Width"),
  ]);
  expect(badge("Body")).toHaveTextContent(/^Mixed$/);
  expect(badge("Size")).toHaveTextContent(/^Mixed$/);
  expect(badge("Size")).toHaveAttribute(
    "title",
    "This performer has different answers in this category (listed under Body).",
  );
});

it("says answers are mixed here too when a category beside the row speaks for some of them", () => {
  // Tags 31 and 32 have two parents, Shape and Cut; Cut takes one answer, its answers removing
  // its tree, so it speaks for the Width group, while the Depth group lies in Shape alone.
  const both: AnswerSummary = {
    answered: 7,
    groups: [
      shape.groups[0],
      {
        id: 50,
        name: "Cut",
        members: [50, 31, 32, 60],
        tags: [held(31, "Round", 3), held(32, "Square", 1)],
      },
    ],
  };
  show(both, [
    answer("plain", 60, undefined, 50),
    answer("round", 31, "Width"),
    answer("square", 32, "Width"),
    answer("thin", 33, "Depth"),
    answer("wide", 34, "Depth"),
  ]);
  expect(badge("Shape")).toHaveTextContent(/^Mixed here and in Depth$/);
  expect(badge("Shape")).toHaveAttribute(
    "title",
    "This performer has different answers in this category (listed under Cut) and in Depth.",
  );
  expect(badge("Cut")).toHaveTextContent(/^Mixed$/);
});

it("names a mixed group inside a category taking one answer as the attention does, after the category", () => {
  // Body holds several answers at once; Size inside it takes one, as its answers remove its tree;
  // the Width group inside Size holds the performer's two sizes.
  const body: AnswerSummary = {
    answered: 5,
    groups: [
      {
        id: 20,
        name: "Body",
        members: [20, 30, 31, 32, 40],
        tags: [held(32, "Medium", 3), held(40, "Tall", 2), held(31, "Small", 1)],
      },
      {
        id: 30,
        name: "Size",
        members: [30, 31, 32],
        tags: [held(32, "Medium", 3), held(31, "Small", 1)],
      },
    ],
  };
  const view = show(body, [answer("small", 31, "Width", 30), answer("medium", 32, "Width", 30)]);
  // The attention names Size alone, so the Body row names Size too, not the group Size holds.
  expect(badge("Body")).toHaveTextContent(/^Mixed in Size$/);
  expect(badge("Body")).toHaveAttribute("title", "This performer has different answers in Size.");
  expect(badge("Size")).toHaveTextContent(/^Mixed$/);
  view.unmount();
  // Without the tree removals Size holds several answers too, and the group speaks for itself.
  show(body, [answer("small", 31, "Width"), answer("medium", 32, "Width")]);
  expect(badge("Body")).toHaveTextContent(/^Mixed in Width$/);
  expect(badge("Size")).toHaveTextContent(/^Mixed in Width$/);
});

it("names what speaks for a row taking one answer inside another, before and after its tree is known", () => {
  // Outer holds Inner, which holds the performer's two answers; the answers, one group, remove
  // Outer's tree, which holds all of Inner once it is known: then Inner takes one answer too.
  const nested: AnswerSummary = {
    answered: 4,
    groups: [
      {
        id: 30,
        name: "Outer",
        members: [30, 31, 32, 33, 34],
        tags: [held(32, "One", 3), held(33, "Two", 1)],
      },
      {
        id: 31,
        name: "Inner",
        members: [31, 32, 33],
        tags: [held(32, "One", 3), held(33, "Two", 1)],
      },
    ],
  };
  const actions = [answer("one", 32, "Pick", 30), answer("two", 33, "Pick", 30)];
  // The attention names Outer alone either way, and so does Inner's tooltip.
  for (const trees of [NO_TREES, new Map([[30, [30, 31, 32, 33, 34]]])]) {
    const view = show(nested, actions, trees);
    expect(badge("Outer")).toHaveTextContent(/^Mixed$/);
    expect(badge("Inner")).toHaveTextContent(/^Mixed$/);
    expect(badge("Inner")).toHaveAttribute(
      "title",
      "This performer has different answers in this category (listed under Outer).",
    );
    view.unmount();
  }
});

it("names a group by the places inside the row that speak for it, whatever speaks for it beside", () => {
  // Round and Square have two parents, Inner (inside Shape) and Cut (beside Shape); both take one
  // answer, their answers removing their trees, and both speak for the Width group.
  const both: AnswerSummary = {
    answered: 4,
    groups: [
      {
        id: 30,
        name: "Shape",
        members: [30, 35, 31, 32, 33],
        tags: [held(31, "Round", 3), held(32, "Square", 1)],
      },
      {
        id: 35,
        name: "Inner",
        members: [35, 31, 32],
        tags: [held(31, "Round", 3), held(32, "Square", 1)],
      },
      {
        id: 50,
        name: "Cut",
        members: [50, 31, 32, 60],
        tags: [held(31, "Round", 3), held(32, "Square", 1)],
      },
    ],
  };
  show(both, [
    answer("round", 31, "Width", 35),
    answer("square", 32, "Width", 35),
    answer("plain", 60, undefined, 50),
  ]);
  expect(badge("Shape")).toHaveTextContent(/^Mixed in Inner$/);
  expect(badge("Shape")).toHaveAttribute("title", "This performer has different answers in Inner.");
});

it("never names the row's own answers after the category that speaks for them", () => {
  // Two categories known only by the answers they hold, the same two: the first speaks for both.
  const alike: AnswerSummary = {
    answered: 3,
    groups: [
      { id: 30, name: "First", tags: [held(31, "One", 2), held(32, "Two", 1)] },
      { id: 40, name: "Second", tags: [held(31, "One", 2), held(32, "Two", 1)] },
    ],
  };
  show(alike, [answer("one", 31, undefined, 30), answer("two", 32, undefined, 40)]);
  expect(badge("First")).toHaveAttribute("title", "This performer has different answers in this category.");
  expect(badge("Second")).toHaveTextContent(/^Mixed$/);
  expect(badge("Second")).toHaveAttribute(
    "title",
    "This performer has different answers in this category (listed under First).",
  );
});
