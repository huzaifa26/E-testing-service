import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


export default function LazyImage(props) {
    return (
        <LazyLoadImage
            alt={props.alt}
            src={props.src}
            effect="blur"
            className='relative z-[10]'
        />
    )
}