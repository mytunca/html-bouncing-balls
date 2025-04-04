import { h, render, Fragment } from "https://esm.sh/preact";
import { useState, useEffect, useRef } from "https://esm.sh/preact/hooks";
import htm from "https://esm.sh/htm";

// Initialize htm with Preact
const html = htm.bind(h);

export { html, render, useState, useEffect, useRef, Fragment };
