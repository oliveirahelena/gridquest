/**
 * Uma extensão de programação em blocos visuais para crianças, baseada em um grid.
 */
//% color="#FF7F50" icon="\uf11b" block="Grid Quest"
namespace gridQuest {

    let characterSprite: Sprite = null;
    let gridInitialized = false;
    let justTeleported = false; // Variável de controle para o portal
    const PAUSE_DURATION = 500; // Meio segundo de pausa entre as ações

    /**
     * Verifica o tile atual do personagem e aplica a lógica do jogo.
     */
    function _checkTileLogic() {
        const currentLocation = characterSprite.tilemapLocation();

        // Lógica do Portal
        if (tiles.tileAtLocationEquals(currentLocation, assets.tile`portal`)) {
            if (justTeleported) {
                // Se acabou de teleportar, não faz nada para evitar o loop.
                return;
            }

            // Encontra todos os outros portais no mapa
            const allPortals = tiles.getTilesByType(assets.tile`portal`);
            let destination: tiles.Location = null;

            for (const portal of allPortals) {
                if (portal.col !== currentLocation.col || portal.row !== currentLocation.row) {
                    destination = portal;
                    break;
                }
            }

            if (destination) {
                justTeleported = true; // Ativa a trava de teleporte
                grid.place(characterSprite, destination);
                // Uma pequena pausa para o jogador entender o teleporte
                pause(300);
            }
            return; // Sai da função após teleportar
        }

        // Lógica da Lava
        if (tiles.tileAtLocationEquals(currentLocation, assets.tile`lava`)) {
            game.over(false); // Game over, perdeu
            return;
        }

        // Lógica da Chegada
        if (tiles.tileAtLocationEquals(currentLocation, assets.tile`chegada`)) {
            game.over(true); // Venceu o jogo!
            return;
        }
    }

    function _positionCharacter() {
        if (!gridInitialized) return;

        // Posiciona o personagem         
        let locations = tiles.getTilesByType(assets.tile`inicio`)
        let loc = null;
        for (let location of locations) {
            loc = location;
            break;
        }
        if (loc == null) {
            loc = {
                column: 0,
                row: 0
            }
        }
        grid.place(characterSprite, tiles.getTileLocation(loc.column, loc.row))
    }

    /**
     * Prepara o ambiente de grid e o personagem.
     * Cria um tilemap simples e posiciona o personagem no centro.
     */
    function _initializeGridAndCharacter() {
        if (gridInitialized) return;

        // Cria um tilemap de fundo simples para o grid funcionar
        tiles.setTilemap(tilemap`level1`);

        // Cria o personagem com uma imagem padrão
        characterSprite = sprites.create(assets.image`player`, SpriteKind.Player);

        gridInitialized = true;
    }

    /**
     * Muda a aparência do personagem. Clique no quadrado cinza para desenhar!
     * @param img A nova imagem para o personagem
     */
    //% block="MUDAR PERSONAGEM PARA 🧍%img=screen_image_picker"
    //% group="Personagem" weight=100
    export function mudarPersonagem(img: Image): void {
        _initializeGridAndCharacter();
        characterSprite.setImage(img);
        pause(PAUSE_DURATION);
    }

    /**
     * Muda a cor de fundo do cenário.
     * @param color A nova cor para o fundo
     */
    //% block="🖼️ MUDAR CENÁRIO PARA %map"
    //% group="Cenário" weight=90
    export function mudarCenario(map: tiles.TileMapData): void {
        _initializeGridAndCharacter();
        tiles.setTilemap(map);
        // Reposiciona o personagem no início do novo mapa
        _positionCharacter();
        pause(PAUSE_DURATION);
    }

    function _moveAndCheck(dx: number, dy: number) {
        _initializeGridAndCharacter();
        justTeleported = false; // Reseta a trava do portal a cada novo movimento
        grid.move(characterSprite, dx, dy);
        pause(PAUSE_DURATION);
        _checkTileLogic(); // Verifica a lógica do jogo após o movimento
    }

    /**
     * Move o personagem um tile para a direita.
     */
    //% block="`ICON.arrow-right-white`"
    //% group="Movimento"
    export function moveRight() {
        _moveAndCheck(1, 0);
    }

    /**
     * Move o personagem um tile para a esquerda.
     */
    //% block="`ICON.arrow-left-white`"
    //% group="Movimento"
    export function moveLeft() {
        _moveAndCheck(-1, 0);
    }

    /**
     * Move o personagem um tile para cima.
     */
    //% block="`ICON.arrow-up-white`"
    //% group="Movimento"
    export function moveUp() {
        _moveAndCheck(0, -1);
    }

    /**
     * Move o personagem um tile para baixo.
     */
    //% block="`ICON.arrow-down-white`"
    //% group="Movimento"
    export function moveDown() {
        _moveAndCheck(0, 1);
    }

    /**
     * Faz o personagem pular dois tiles para a direita.
     */
    //% block="`ICON.arrow-right-white``ICON.arrow-right-white`"
    //% group="Ações"
    export function jumpRight() {
        _moveAndCheck(2, 0);
    }

    /**
     * Faz o personagem pular dois tiles para a esquerda.
     */
    //% block="`ICON.arrow-left-white``ICON.arrow-left-white`"
    //% group="Ações"
    export function jumpLeft() {
        _moveAndCheck(-2, 0);
    }

    /**
     * Faz o personagem pular dois tiles para cima.
     */
    //% block="`ICON.arrow-up-white``ICON.arrow-up-white`"
    //% group="Ações"
    export function jumpUp() {
        _moveAndCheck(0, -2);
    }

    /**
     * Faz o personagem pular dois tiles para baixo.
     */
    //% block="`ICON.arrow-down-white``ICON.arrow-down-white`"
    //% group="Ações"
    export function jumpDown() {
        _moveAndCheck(0, 2);
    }
}