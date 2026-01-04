import React, {useState, useEffect} from 'react';
//Libraries
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { default as FastImageView } from "react-native-fast-image";
import colors from '../../constants/colors';


export default FastImage = (props) =>  {
    const [loading, setLoading] = useState(false);

    const handleImageOnLoadStart = () => {
        setLoading(true);
    }

    const handleImageOnLoadEnd = () => {
        setLoading(false);
    };

    return (
        <>
        <FastImageView
            style={{width: '100%', height: '100%', display: loading ? 'none' : 'flex'}}
            source={props.source}
            resizeMode={props.resizeMode == 'contain' ? FastImageView.resizeMode.contain : FastImageView.resizeMode.cover}
            onLoadStart={handleImageOnLoadStart}
            onLoadEnd={handleImageOnLoadEnd}
        />
        {loading   && (
            <SkeletonPlaceholder backgroundColor={colors.inactiveGrey} highlightColor={colors.black20}>
                <SkeletonPlaceholder.Item width="100%" height="100%" />
            </SkeletonPlaceholder>
        )}
        </>
    );
}

