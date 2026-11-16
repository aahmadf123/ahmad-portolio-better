// Loaded asynchronously by MotionProvider so framer-motion's animation and
// layout engine stays out of the initial JS that blocks first paint.
// domMax (not domAnimation): the site relies on layout animations
// (layoutId poster<->modal morph, AnimatePresence mode="popLayout").
import { domMax } from 'framer-motion';

export default domMax;
