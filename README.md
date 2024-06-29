# 인천 블록체인 실습

### Node.js Npm 설치 방법

Node.js를 설치하는 방법은 운영 체제에 따라 다릅니다. 아래는 주요 운영 체제별 설치 방법입니다.

#### Windows

1. [Node.js 공식 웹사이트](https://nodejs.org/)로 이동합니다.
2. "LTS" 버전 또는 최신 "Current" 버전을 다운로드합니다.
3. 다운로드한 설치 프로그램을 실행하고 설치 지침을 따릅니다.

#### macOS

1. [Node.js 공식 웹사이트](https://nodejs.org/)로 이동합니다.
2. "LTS" 버전 또는 최신 "Current" 버전을 다운로드합니다.
3. 다운로드한 설치 프로그램을 실행하고 설치 지침을 따릅니다.

또는 Homebrew를 사용하여 설치할 수 있습니다:

```sh
brew install node
```

설치 확인 Node.js와 npm이 올바르게 설치되었는지 확인하려면 터미널이나 명령 프롬프트를 열고 다음 명령어를 실행합니다:

```sh
node -v
npm -v
```

### VSCode Plugin

Nomic Foundation의
[Solidity 확장 프로그램](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity)
[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Solidity 스마트 계약 개발을 위한 Hardhat 기반 library

- [Hardhat](https://github.com/nomiclabs/hardhat): 스마트 계약 컴파일, 실행 및 테스트
- [TypeChain](https://github.com/ethereum-ts/TypeChain): 스마트 계약을 위한 TypeScript 바인딩 생성
- [Ethers](https://github.com/ethers-io/ethers.js/): 유명한 이더리움 라이브러리 및 지갑 구현
- [Solhint](https://github.com/protofire/solhint): 코드 린터
- [Solcover](https://github.com/sc-forks/solidity-coverage): 코드 커버리지
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): 코드 포매터

### GitHub Actions

이 템플릿은 GitHub Actions이 미리 설정된 상태입니다. 당신의 계약들은 `main` 브랜치로의 각 푸시와 풀 리퀘스트마다 린트 및
테스트됩니다.

다만, 이 작업을 하기 위해서는 `INFURA_API_KEY`와 `MNEMONIC`을 GitHub 시크릿으로 설정해야 합니다.

GitHub 시크릿 설정에 대한 자세한 정보는
[문서](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)를 참조하시기 바랍니다.

[.github/workflows/ci.yml](./.github/workflows/ci.yml)에서 CI 스크립트를 수정할 수 있습니다.

## 사용법

### 준비 사항

먼저 의존성을 설치해야 합니다:

```sh
npm install
```

그런 다음 필요한 모든 [Hardhat 구성 변수](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables)를
설정해야 합니다. 선택 사항인 몇 가지도 설치할 수 있습니다.

설정 프로세스를 지원하기 위해 `npx hardhat vars setup`을 실행하세요. BIP-39 니모닉 변수와 같은 특정 값을 설정하려면
다음을 실행하세요:

```sh
npx hardhat vars set MNEMONIC
? Enter value: ‣ here is where your twelve words mnemonic should be put my friend
```

```sh
npx hardhat vars set INFURA_API_KEY
? Enter value: ‣ here is where your infura api key
```

만약 니모닉을 아직 가지고 있지 않다면, [이 웹사이트](https://iancoleman.io/bip39/)를 사용하여 니모닉을 생성할 수
있습니다.

### Compile

Hardhat으로 컴파일 하는 방법:

```sh
npm run compile
```

### TypeChain

컴파일 후 TypeChain을 이용하여 스마트 컨트랙트와 typescript bindings을 만든다:

```sh
npm run typechain
```

### Test

하드햇으로 테스트 하는 방법:

```sh
npm run test
```

### Lint Solidity

솔리디티 코드 린트 하는 방법:

```sh
npm run lint:sol
```

### Lint TypeScript

타입스크립트 코드 린트 하는 방법:

```sh
npm run lint:ts
```

### Coverage

코드에 대한 커버리지 리포트 보는 방법:

```sh
npm run coverage
```

### Report Gas

각 유닛 테스트 별 가스 사용량 및 평균적인 메소드 콜 별 가스 사용량 보기:

```sh
REPORT_GAS=true npm run test
```

### Clean

스마트 계약 아티팩트, 커버리지 보고서 및 Hardhat 캐시를 삭제합니다:

```sh
npm run clean
```

### Deploy

하드햇 네트워크에 컨트랙트 배포 방법:

```sh
npx hardhat deploy-erc20 --name "MyToken" --symbol "MTK" --supply "1000000" --network localhost
```

### Tasks

ERC20 전송:

```sh
npx hardhat transfer-erc20 --contract <ERC20_CONTRACT_ADDRESS> --to <RECIPIENT_ADDRESS> --amount "100" --network localhost
```

잔액 조회:

```sh
npx hardhat balance-of --contract <ERC20_CONTRACT_ADDRESS> --account <ACCOUNT_ADDRESS> --network localhost
```

토큰 승인:

```sh
npx hardhat approve --contract <ERC20_CONTRACT_ADDRESS> --spender <SPENDER_ADDRESS> --amount "100" --network localhost
```

승인된 잔액 조회:

```sh
npx hardhat allowance --contract <ERC20_CONTRACT_ADDRESS> --owner <OWNER_ADDRESS> --spender <SPENDER_ADDRESS> --network localhost
```

승인된 토큰 전송:

```sh
npx hardhat transfer-from --contract <ERC20_CONTRACT_ADDRESS> --from <OWNER_ADDRESS> --to <RECIPIENT_ADDRESS> --amount "100" --network localhost

```

ERC721 배포:

```sh
npx hardhat deploy-erc721 --name "MyToken" --symbol "MTK" --network localhost
```

ERC721 민팅:

```sh
npx hardhat mint-erc721 --contract <ERC721_CONTRACT_ADDRESS> --to <RECIPIENT_ADDRESS> --uri
"https://mytoken.com/token/1" --network localhost
```

ERC721 전송 (transferFrom):

```sh
npx hardhat transferFrom-erc721 --contract <ERC721_CONTRACT_ADDRESS> --from <FROM_ADDRESS> --to <TO_ADDRESS> --tokenId 1 --network localhost
```

ERC721 승인 (approve):

```sh
npx hardhat approve-erc721 --contract <ERC721_CONTRACT_ADDRESS> --to <APPROVED_ADDRESS> --tokenId 1
--network localhost
```

ERC721 승인된 주소 확인 (getApproved):

```sh
npx hardhat getApproved-erc721 --contract <ERC721_CONTRACT_ADDRESS> --tokenId 1 --network localhost
```

모든 토큰에 대한 승인 (setApprovalForAll):

```sh
npx hardhat setApprovalForAll-erc721 --contract <ERC721_CONTRACT_ADDRESS> --operator <OPERATOR_ADDRESS> --approved true --network localhost
```

모든 토큰에 대한 승인 여부 확인 (isApprovedForAll):

```sh
npx hardhat isApprovedForAll-erc721 --contract <ERC721_CONTRACT_ADDRESS> --owner <OWNER_ADDRESS> --operator <OPERATOR_ADDRESS> --network localhost
```

## License

This project is licensed under MIT.
