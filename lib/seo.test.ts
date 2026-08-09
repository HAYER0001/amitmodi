/*
 * lib/seo.test.ts — the buildMetadata contract (Phase 17, Agent A).
 *
 * buildMetadata must THROW on an over-length title or description — a
 * build-time failure is the only enforcement that survives contact with a
 * deadline. These tests lock that behaviour in.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildMetadata,
  withSiteName,
  fitDescription,
  TITLE_LIMIT,
  DESCRIPTION_LIMIT,
  SITE_NAME,
} from "./seo";

test("buildMetadata returns a complete metadata object for a valid call", () => {
  const meta = buildMetadata({
    title: "GST Registration",
    description: "What GST registration is and when it is mandatory.",
    path: "/services/gst-registration",
  });
  const robots = meta.robots as {
    "max-snippet"?: number;
    "max-image-preview"?: string;
    "max-video-preview"?: number;
  };
  const og = meta.openGraph as { type?: string; locale?: string };
  assert.equal(meta.title, "GST Registration");
  assert.equal(meta.description, "What GST registration is and when it is mandatory.");
  assert.equal(meta.alternates?.canonical, "/services/gst-registration");
  assert.deepEqual(meta.alternates?.languages, { "en-IN": "/services/gst-registration" });
  assert.equal(robots["max-snippet"], -1);
  assert.equal(robots["max-image-preview"], "large");
  assert.equal(robots["max-video-preview"], -1);
  assert.equal(og.locale, "en_IN");
  assert.equal(og.type, "website");
});

test("buildMetadata throws when the title exceeds the 60-character limit", () => {
  const title = "x".repeat(TITLE_LIMIT + 1);
  assert.throws(
    () =>
      buildMetadata({
        title,
        description: "fine",
        path: "/",
      }),
    /exceeds 60 characters/,
  );
});

test("buildMetadata throws when the description exceeds 155 characters", () => {
  const description = "y".repeat(DESCRIPTION_LIMIT + 1);
  assert.throws(
    () =>
      buildMetadata({
        title: "Fine title",
        description,
        path: "/",
      }),
    /exceeds 155 characters/,
  );
});

test("withSiteName appends the brand suffix and stays under the limit", () => {
  const title = withSiteName("GST Registration");
  assert.equal(title, `GST Registration | ${SITE_NAME}`);
  assert.ok(title.length <= TITLE_LIMIT);
});

test("withSiteName fits a long content title instead of throwing", () => {
  const long = "The complete GST compliance guide for a growing business, including what changes when turnover crosses each threshold";
  const title = withSiteName(long);
  assert.ok(title.length <= TITLE_LIMIT);
  assert.ok(title.endsWith("…"));
});

test("fitDescription keeps any summary within 155 characters", () => {
  const long = "z".repeat(400);
  const fitted = fitDescription(long);
  assert.ok(fitted.length <= DESCRIPTION_LIMIT);
  assert.ok(fitted.endsWith("…"));
});
