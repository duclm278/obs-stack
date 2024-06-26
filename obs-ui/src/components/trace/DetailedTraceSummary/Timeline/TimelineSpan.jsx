import _ from "lodash";
import { MinusSquare, PlusSquare } from "lucide-react";
import PropTypes from "prop-types";
import React from "react";
import { detailedSpanPropTypes } from "../prop-types";
import {
  getColorFromSpan,
  getCriticalPathColor,
  getMarkerColor,
  getSpanBackgroundClass,
} from "../util/color";
import {
  getBorderRadiusFromSpan,
  getCriticalPathHeightFromSpan,
  getHeightFromSpan,
} from "../util/size";
import TimelineSpanData from "./TimelineSpanData";

const propTypes = {
  startTs: PropTypes.number.isRequired,
  endTs: PropTypes.number.isRequired,
  traceDuration: PropTypes.number.isRequired,
  traceTimestamp: PropTypes.number.isRequired,
  numTimeMarkers: PropTypes.number.isRequired,
  serviceNameColumnWidth: PropTypes.number.isRequired,
  spanNameColumnWidth: PropTypes.number.isRequired,
  span: detailedSpanPropTypes.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  areChildrenOpened: PropTypes.bool.isRequired,
  areDataOpened: PropTypes.bool.isRequired,
  onChildrenOpenToggle: PropTypes.func.isRequired,
  onDataOpenToggle: PropTypes.func.isRequired,
  disabledCriticalPath: PropTypes.bool.isRequired,
};

class TimelineSpan extends React.Component {
  constructor(props) {
    super(props);
    this.handleChildrenOpenToggle = this.handleChildrenOpenToggle.bind(this);
    this.handleDataOpenToggle = this.handleDataOpenToggle.bind(this);
  }

  calculateLeftAndWidthArr() {
    let measuremetArr = [];
    let left;
    let width;
    const { startTs, endTs, traceDuration, span } = this.props;

    span.measures.forEach((measure) => {
      const spanStartTs = (measure.left * traceDuration) / 100;
      const spanEndTs = spanStartTs + (measure.width * traceDuration) / 100;
      const newDuration = endTs - startTs;

      if (spanStartTs < startTs && spanEndTs < startTs) {
        //  SPAN   |------------------------------|
        //  DRAG                                    |-------|
        left = 0;
        width = 0;
      } else if (spanStartTs >= endTs) {
        // SPAN              |------------------------------|
        // DRAG |----------|
        left = 100;
        width = 0;
      } else if (
        spanStartTs < startTs &&
        spanEndTs > startTs &&
        spanEndTs < endTs
      ) {
        // SPAN |--------------------------------------|
        // DRAG                                   |---------|
        left = 0;
        width = ((spanEndTs - startTs) / newDuration) * 100;
      } else if (
        spanStartTs < startTs &&
        spanEndTs > startTs &&
        spanEndTs > endTs
      ) {
        // SPAN |-------------------------------------------|
        // DRAG                 |------|
        left = 0;
        width = 100;
      } else if (
        spanStartTs >= startTs &&
        spanStartTs < endTs &&
        spanEndTs <= endTs
      ) {
        // SPAN         |---------------------------|
        // DRAG |-------------------------------------------|
        left = ((spanStartTs - startTs) / newDuration) * 100;
        width = ((spanEndTs - spanStartTs) / newDuration) * 100;
      } else if (
        spanStartTs >= startTs &&
        spanStartTs < endTs &&
        spanEndTs > endTs
      ) {
        // SPAN       |-------------------------------------|
        // DRAG |------------------------------------|
        left = ((spanStartTs - startTs) / newDuration) * 100;
        width = ((endTs - spanStartTs) / newDuration) * 100;
      } else {
        left = 0;
        width = 0;
      }
      measuremetArr.push({
        left,
        width,
        isBelongToChild: measure.isBelongToChild,
      });
    });

    return measuremetArr;
  }

  calculateBaseWidth(finishTs, startTs) {
    const { traceDuration } = this.props;
    return ((finishTs - startTs) / traceDuration) * 100;
  }

  calculateBaseLeft(startTs) {
    const { traceDuration, traceTimestamp } = this.props;
    return ((startTs - traceTimestamp) / traceDuration) * 100;
  }

  //
  handleChildrenOpenToggle(e) {
    const { span, onChildrenOpenToggle } = this.props;
    onChildrenOpenToggle(span.spanId);
    e.stopPropagation();
    /* Stop event bubbling, TODO: does it needed? */
  }

  //
  handleDataOpenToggle() {
    // console.log("TimelineSpan, handleDataOpenToggle; props: ", this.props);
    const { span, onDataOpenToggle } = this.props;
    onDataOpenToggle(span.spanId);
  }

  renderServiceName = () => {
    const { span } = this.props;
    if (span) {
      const icon = span?.tagsObj["ttc_icon"];
      return (
        <span style={{ display: "flex", alignItems: "center" }}>
          {icon && icon}
          {span.serviceName}
        </span>
      );
    }
  };

  renderServiceNameColumn() {
    const { span, hasChildren, areChildrenOpened } = this.props;

    return (
      <div className="timeline-span__service-name-column">
        {hasChildren ? (
          <div
            className="timeline-span__open-toggle-button"
            style={{ left: `${(span.depth - 1) * 14}px` }}
            onClick={this.handleChildrenOpenToggle}
            role="presentation"
          >
            {areChildrenOpened ? (
              <span className="timeline-span__open-toggle-button--minus">
                {/* <FontAwesomeIcon icon={faMinusSquare} /> */}
                <MinusSquare size={16} />
              </span>
            ) : (
              <span className="timeline-span__open-toggle-button--plus">
                {/* <FontAwesomeIcon icon={faPlusSquare} /> */}
                <PlusSquare size={16} />
              </span>
            )}
          </div>
        ) : null}
        <span
          className="timeline-span__depth-marker"
          style={{
            left: `${span.depth * 14}px`,
            background: `${getMarkerColor(span)}`,
          }}
        />
        <div
          className="timeline-span__service-name-wrapper"
          style={{ left: `${(span.depth + 1) * 14}px` }}
        >
          <div className="timeline-span__service-name">
            {this.renderServiceName()}
          </div>
        </div>
      </div>
    );
  }

  renderTimeMarkers() {
    const { numTimeMarkers } = this.props;

    const timeMarkers = [];
    for (let i = 1; i < numTimeMarkers - 1; i += 1) {
      const portion = i / (numTimeMarkers - 1);
      timeMarkers.push(
        <span
          key={portion}
          className="timeline-span__time-marker"
          style={{ left: `${portion * 100}%` }}
        />,
      );
    }
    return timeMarkers;
  }

  renderSpanDuration(left, width) {
    const { span } = this.props;

    if (parseInt(left, 10) > 50) {
      return (
        <span
          className="timeline-span__duration timeline-span__duration--right"
          style={{ right: `${100 - (left + width)}%` }}
        >
          {span.durationStr}
        </span>
      );
    }

    return (
      <span
        className="timeline-span__duration timeline-span__duration--left"
        style={{ left: `${left}%` }}
      >
        {span.durationStr}
      </span>
    );
  }

  renderSpanBar() {
    const measures = this.calculateLeftAndWidthArr();
    const { showDuration = true, span, disabledCriticalPath } = this.props;

    return (
      <div className="timeline-span__bar-container">
        {_.uniqWith(measures, _.isEqual).map(
          ({ left, width, isBelongToChild }) => {
            return (
              <React.Fragment key={`${left}-${width}-${isBelongToChild}`}>
                <span
                  className="timeline-span__bar"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: `${getColorFromSpan(span)}`,
                    borderRadius: `${getBorderRadiusFromSpan(span)}`,
                    height: `${getHeightFromSpan(span)}`,
                  }}
                />
                {!disabledCriticalPath && (
                  <span
                    className="timeline-span__bar line"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      height: `${getCriticalPathHeightFromSpan(span)}`,
                      zIndex: `8`,
                      background: `${getCriticalPathColor(span)}`,
                      borderRadius: `${getBorderRadiusFromSpan(span)}`,
                    }}
                  />
                )}
                {!disabledCriticalPath && isBelongToChild && (
                  <span
                    className="timeline-span__bar line"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      height: `${getCriticalPathHeightFromSpan(span)}`,
                      zIndex: `8`,
                      background: `${getColorFromSpan(span)}`,
                      borderRadius: `${getBorderRadiusFromSpan(span)}`,
                    }}
                  />
                )}

                {!isBelongToChild &&
                  showDuration &&
                  this.renderSpanDuration(left, width)}
              </React.Fragment>
            );
          },
        )}
      </div>
    );
  }

  render() {
    // console.log("TimelineSpan; props: ", this.props);

    const {
      span,
      serviceNameColumnWidth,
      spanNameColumnWidth,
      areDataOpened,
      showSpanDetail,
      showSpanDetailTitle,
      spanHighlights,
    } = this.props;

    // This is to set exta class to highlight bgcolor of selected span.
    let timelineSpanClass = "timeline-span";
    if (this.props.selectedSpanId === span.spanId) {
      timelineSpanClass = `${timelineSpanClass} selected-span`;
    }

    // Lower opacity values for not highlighted spans.
    if (spanHighlights.length > 0 && !spanHighlights.includes(span.spanId)) {
      timelineSpanClass = `${timelineSpanClass} insignificant-span`;
    }

    // Add reddish background color to erroneous span.
    const bgClass = getSpanBackgroundClass(span);
    if (bgClass) {
      timelineSpanClass = `${timelineSpanClass} ${bgClass}`;
    }

    return (
      <div>
        <div
          role="presentation"
          className={timelineSpanClass}
          onClick={this.handleDataOpenToggle}
        >
          <div
            className="timeline-span__service-name-column-wrapper"
            style={{ minWidth: `${serviceNameColumnWidth * 100}%` }}
          >
            {this.renderServiceNameColumn()}
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            {showSpanDetailTitle && (
              <div
                className="timeline-span__span-name-column-wrapper"
                style={{ width: `${spanNameColumnWidth * 100}%` }}
              >
                <div className="timeline-span__span-name-column">
                  {span.spanName}
                </div>
              </div>
            )}
            <div
              className="timeline-span__bar-wrapper"
              style={{
                width: `${(1 - (showSpanDetailTitle ? spanNameColumnWidth : 0)) * 100}%`,
              }}
            >
              {this.renderTimeMarkers()}
              {this.renderSpanBar()}
            </div>
          </div>
        </div>

        {showSpanDetail && areDataOpened ? (
          <TimelineSpanData
            span={span}
            serviceNameColumnWidth={serviceNameColumnWidth}
            showSpanDetailTitle={showSpanDetailTitle}
            spanDetail={this.props.spanDetail}
          />
        ) : null}
      </div>
    );
  }
}

TimelineSpan.propTypes = propTypes;

export default TimelineSpan;
