import { render, within } from "@testing-library/react";
import Seo from "./Seo";

describe("Seo", () => {
  it("uses the live og image by default", () => {
    render(<Seo />);

    const head = within(document.head);
    expect(head.getByTestId("og-image").getAttribute("content")).toBe(
      "https://gantabyaa.com/gantabyaa_og.png"
    );
  });
});
