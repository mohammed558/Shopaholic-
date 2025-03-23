import { motion } from "framer-motion";

export  function MotionButton({ children, style, onClick, ...props }) {
  return (
    <motion.button
      style={style}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export  function MotionDiv({ children, style, onClick, ...props }) {
    return (
      <motion.div
        style={style}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  export function MotionImage({ src, alt, style, ...props }) {
    return (
      <motion.img
        src={src}
        alt={alt}
        style={style}
        whileHover={{ scale: 1.05 }} // Slight zoom effect on hover
        whileTap={{ scale: 0.95 }}   // Slight shrink effect on tap
        {...props}
      />
    );
  }


  export function MotionLink({ children, href, style, onClick, ...props }) {
    return (
      <motion.a
        href={href}
        style={style}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.a>
    );
  }