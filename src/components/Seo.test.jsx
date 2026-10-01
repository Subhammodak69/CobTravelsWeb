import { render } from "@testing-library/react";
import Seo from "./Seo";

describe("Seo", () => {
  it("uses the live og image by default", () => {
    render(<Seo />);

    expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute("content")).toBe(
      "https://gantabyaa.com/gantabyaa_og.png"
    );
  });
});
