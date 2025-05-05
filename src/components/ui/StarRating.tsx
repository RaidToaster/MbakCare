import {AiFillStar} from "react-icons/ai";

function StarRating({rating}: {rating: number}) {
    const maxStars = 5;
    const size = 16;

    const boundedRating = Math.max(0, Math.min(maxStars, rating));

    const full = Math.floor(boundedRating);

    const partial = boundedRating % 1;


    return (
        <div className="flex gap-1 items-center">
            {Array.from({ length: maxStars }, (_, i) => {
                if (i < full) {
                    return <AiFillStar key={i} size={size} fill="#EFBB4B" color="#EFBB4B" />;
                } else if (i === full && partial > 0) {
                    return (
                        <div key={i} className="relative">
                            <AiFillStar size={size} fill="#D9D9D9" color="#D9D9D9" />

                            <div
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{ width: `${partial * 100}%` }}
                            >
                                <AiFillStar size={size} fill="#EFBB4B" color="#EFBB4B" />
                            </div>
                        </div>
                    );
                } else {
                    return <AiFillStar key={i} size={size} fill="#D9D9D9" color="#D9D9D9"/>;
                }
            })}
        </div>
    );
}

export default StarRating;