class Structure extends Entity {

    type = 'structure';
    categories = ['structure'];
    color = '#1e293b';

    z = Z_STRUCTURE;

    constructor(matrix) {
        super();
        this.matrix = matrix || [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.width = this.matrix[0].length * CELL_SIZE;
        this.height = this.matrix.length * CELL_SIZE;
    }

    render() {
        if (!this.matrix) return;

        const rows = this.matrix.length;
        const cols = this.matrix[0].length;

        this.prerendered = this.prerendered || createCanvas(this.width, this.height, (ctx) => {
            for (let row = 0 ; row < rows ; row++) {
                for (let col = 0 ; col < cols ; col++) {
                    const cell = this.matrix[row][col];
                    if (cell === 1) {
                        ctx.fillStyle = '#334155';
                        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                        ctx.strokeStyle = '#475569';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
                    } else if (cell === 2) {
                        ctx.fillStyle = '#38bdf8';
                        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE / 4);
                    }
                }
            }
        });

        ctx.drawImage(this.prerendered, this.x, this.y);
    }

    reposition(entity, radiusX, radiusY, previousX, previousY) {
        let remainingIterations = 2;
        while (remainingIterations-- > 0) {
            const { x, y } = entity;
            const leftX = entity.x - radiusX;
            const rightX = entity.x + radiusX;
            const topY = entity.y - radiusY;
            const bottomY = entity.y + radiusY;

            let top = this.cellAt(x, topY);
            let right = this.cellAt(rightX, y) === 1;
            let left = this.cellAt(leftX, y) === 1;
            let bottom = this.cellAt(x, bottomY);

            let topLeft = this.cellAt(leftX, topY) === 1;
            let topRight = this.cellAt(rightX, topY) === 1;
            let bottomLeft = this.cellAt(leftX, bottomY) === 1;
            let bottomRight = this.cellAt(rightX, bottomY) === 1;

            const directionY = sign(y - (previousY || y));

            const verticalCollisionCount = !!top + !!topLeft + !!topRight + !!bottom + !!bottomLeft + !!bottomRight;
            const horizontalCollisionCount = !!left + !!topLeft + !!bottomLeft + !!right + !!topRight + !!bottomRight;

            if (verticalCollisionCount + horizontalCollisionCount == 0) {
                break;
            }

            const resolveVertical = () => {
                if (top && top === 1) entity.y = ceilToNearest(topY, CELL_SIZE) + radiusY;
                if (bottom && (bottom === 1 || directionY > 0)) entity.y = floorToNearest(bottomY, CELL_SIZE) - radiusY;
            };

            const resolveHorizontal = () => {
                if (left) entity.x = ceilToNearest(leftX, CELL_SIZE) + radiusX;
                if (right) entity.x = floorToNearest(rightX, CELL_SIZE) - radiusX;
            };

            if (remainingIterations == 0) {
                resolveVertical();
                resolveHorizontal();
            } else if (verticalCollisionCount > 0) {
                resolveVertical();
            } else {
                resolveHorizontal();
            }
        }
    }

    cellAt(x, y) {
        const row = floor((y - this.y) / CELL_SIZE);
        const col = floor((x - this.x) / CELL_SIZE);
        if (!isBetween(0, row, this.matrix.length - 1)) return null;
        if (!isBetween(0, col, this.matrix[0].length - 1)) return null;

        return this.matrix[row]?.[col] || 0;
    }
}
