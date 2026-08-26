import styles from "./styles.module.css";

// ? 물음표가 있으면, small이나 showText값을 안 넘겨줘도 괜찮다는 뜻
type HeroBannerProps = {
  small?: boolean;
  showText?: boolean;
};

export default function HeroBanner({
  // 누군가 small 값을 안 넘겨주면, false로 받아라.
  small = false,
  showText = true,
}: HeroBannerProps) {
  return (
    <section
      // 탬플릿 리터럴 안에서 조건에 따라 클래스 이름을 다르게 붙힌다.
      // (작은 배너로 쓸 땐 높이를 낮게 만드는 CSS가 추가로 적용된다.)

      className={`${styles.hero} ${small ? styles.small : ""}`}
      // 화면에서는 보이지 않지만, 스크린 리더 같은 보조기기가 읽게 해주는 속성
      aria-label="해변 여행 배너"
    >
      {/* 메인 화면의 큰 배너에서만 여행 문구를 보여준다. */}
      {/* 조건1 && 조건 2 (보여줄 내용) */}

      {!small && showText && (
        <div className={styles.textBox}>
          <p>여행이 시작되는 순간</p>
          <h1>트립트립과 함께하는 특별한 이야기를 만들어가요.</h1>
        </div>
      )}

      <div className={styles.dots} aria-hidden="true">
        {/* 배너 아래쪽 작은 점 4개, aria-hidden true는 스크린 리더가 무시해도 된다는 뜻 */}

        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
